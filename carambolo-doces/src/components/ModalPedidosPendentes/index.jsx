import { useState, useEffect } from "react";
import { axiosApi } from "../../provider/AxiosApi";
import orderSummary from "../../services/orderSummary";
import orderCakeDetails from "../../service/orderCakeDetails";

export default function ModalPedidosPendentes({ isOpen, onClose, tipo, nome, pedidosIds }) {
  const [pedidosAgrupados, setPedidosAgrupados] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [detalhesPedido, setDetalhesPedido] = useState(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  const [pedidoAtivo, setPedidoAtivo] = useState(null);

  // Função auxiliar para extrair número do tamanho (ex: "TAMANHO_17" -> 17)
  const extrairNumeroTamanho = (tamanho) => {
    if (!tamanho || typeof tamanho !== 'string') return 0;
    const match = tamanho.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  useEffect(() => {
    if (isOpen && pedidosIds && pedidosIds.length > 0) {
      loadPedidos();
    } else if (!isOpen) {
      // Resetar estados quando o modal fecha
      setPedidosAgrupados({});
      setModalDetalhesOpen(false);
      setPedidoSelecionado(null);
      setDetalhesPedido(null);
      setPedidoAtivo(null);
    }
  }, [isOpen, pedidosIds]);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      // Resetar estados de detalhes ao carregar novos pedidos
      setModalDetalhesOpen(false);
      setPedidoSelecionado(null);
      setDetalhesPedido(null);
      setPedidoAtivo(null);
      
      // Garantir que pedidosIds seja um array válido
      const idsValidos = Array.isArray(pedidosIds) ? pedidosIds : [];
      
      if (idsValidos.length === 0) {
        setPedidosAgrupados({});
        setLoading(false);
        return;
      }
      
      // Buscar pedidos diretamente pelos IDs para garantir que todos sejam encontrados
      const token = typeof window !== 'undefined' ? localStorage.getItem('JWT_TOKEN') : null;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // Buscar cada pedido individualmente pelos IDs
      const promessasPedidos = idsValidos.map(async (id) => {
        try {
          const response = await axiosApi.get(`/resumo-pedido/${id}`, config);
          return response.data;
        } catch (error) {
          console.warn(`Erro ao buscar pedido ${id}:`, error);
          return null;
        }
      });
      
      const pedidosEncontrados = await Promise.all(promessasPedidos);
      const pedidosFiltrados = pedidosEncontrados.filter(p => 
        p !== null && (p.status === "PENDENTE" || p.status === "PAGO")
      );

      const agrupados = {};

      // Processar todos os pedidos encontrados usando Promise.all para processar em paralelo
      // Filtrar apenas pedidos válidos com pedidoBoloId
      const pedidosValidos = pedidosFiltrados.filter(pedido => 
        pedido && pedido.pedidoBoloId
      );
      
      const promessasDetalhes = pedidosValidos.map(async (pedido) => {
        try {
          const detalhes = await orderCakeDetails(pedido.pedidoBoloId);
          const tamanho = detalhes.tamanho || "TAMANHO_11";
          
          // Buscar informações do cliente e valor do pedido
          const nomeCliente = detalhes.nomeCliente || pedido.nomeCliente || "Cliente";
          const telefone = detalhes.telefone || pedido.telefone || "";
          const tipoEntrega = detalhes.tipoEntrega || pedido.tipoEntrega || "RETIRADA";
          const valor = pedido.valor || 0;
          
          return {
            pedido,
            detalhes,
            tamanho,
            nomeCliente,
            telefone,
            tipoEntrega,
            valor
          };
        } catch (error) {
          console.warn(`Erro ao buscar detalhes do pedido ${pedido.id}:`, error);
          return null;
        }
      });

      // Aguardar todos os detalhes serem buscados
      const resultados = await Promise.all(promessasDetalhes);
      
      // Filtrar resultados nulos e agrupar por tamanho
      const resultadosValidos = resultados.filter(r => r !== null);
      
      resultadosValidos.forEach((resultado) => {
        const { pedido, detalhes, tamanho, nomeCliente, telefone, tipoEntrega, valor } = resultado;
        
        if (!agrupados[tamanho]) {
          agrupados[tamanho] = [];
        }
        
        // Adicionar cada pedido ao array do tamanho correspondente
        agrupados[tamanho].push({
          ...pedido,
          detalhes,
          nomeCliente,
          telefone,
          tipoEntrega,
          valorTotal: valor
        });
      });

      // Ordenar os tamanhos numericamente
      const agrupadosOrdenados = {};
      const tamanhosOrdenados = Object.keys(agrupados).sort((a, b) => {
        const numA = extrairNumeroTamanho(a);
        const numB = extrairNumeroTamanho(b);
        return numA - numB;
      });
      
      tamanhosOrdenados.forEach(tamanho => {
        agrupadosOrdenados[tamanho] = agrupados[tamanho];
      });

      setPedidosAgrupados(agrupadosOrdenados);
    } catch (error) {
      console.warn("Erro ao carregar pedidos:", error);
      setPedidosAgrupados({});
    } finally {
      setLoading(false);
    }
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return "";
    // Remove todos os caracteres não numéricos
    const cleaned = telefone.replace(/\D/g, "");
    
    // Formata para (XX) XXXXX-XXXX (11 dígitos) ou (XX) XXXX-XXXX (10 dígitos)
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    // Se não tiver 10 ou 11 dígitos, retorna como está
    return telefone;
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  const formatarTelefoneCompleto = (telefone) => {
    if (!telefone) return "";
    const cleaned = telefone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return telefone;
  };

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const date = new Date(dataString);
    if (isNaN(date)) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  const formatarCep = (cep) => {
    if (!cep) return "";
    const cleaned = cep.replace(/\D/g, "");
    if (cleaned.length === 8) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return cep;
  };

  const handleAbrirDetalhes = async (pedido) => {
    setPedidoAtivo(pedido.id || pedido);
    
    // Se já está aberto, apenas atualiza o pedido selecionado sem fechar
    if (modalDetalhesOpen) {
      setLoadingDetalhes(true);
      setPedidoSelecionado(pedido);
      
      try {
        if (pedido.pedidoBoloId) {
          const detalhes = await orderCakeDetails(pedido.pedidoBoloId);
          setDetalhesPedido(detalhes);
        }
      } catch (error) {
        console.warn("Erro ao buscar detalhes:", error);
      } finally {
        setLoadingDetalhes(false);
      }
    } else {
      // Primeira vez abrindo - abre o modal primeiro
      setPedidoSelecionado(pedido);
      setModalDetalhesOpen(true);
      setLoadingDetalhes(true);
      
      try {
        if (pedido.pedidoBoloId) {
          const detalhes = await orderCakeDetails(pedido.pedidoBoloId);
          setDetalhesPedido(detalhes);
        }
      } catch (error) {
        console.warn("Erro ao buscar detalhes:", error);
      } finally {
        setLoadingDetalhes(false);
      }
    }
  };

  const handleFecharDetalhes = () => {
    setModalDetalhesOpen(false);
    setPedidoSelecionado(null);
    setDetalhesPedido(null);
    setPedidoAtivo(null);
  };

  const getTamanhoTexto = (tamanho) => {
    if (!tamanho) return "Não especificado";
    
    // Se já está no formato "11cm", retornar como está
    if (tamanho.includes("cm")) {
      return tamanho;
    }
    
    // Extrair número do tamanho (ex: "TAMANHO_17" -> "17cm")
    const numero = extrairNumeroTamanho(tamanho);
    if (numero > 0) {
      return `${numero}cm`;
    }
    
    // Fallback para mapeamento direto
    const tamanhos = {
      "TAMANHO_5": "5cm",
      "TAMANHO_7": "7cm",
      "TAMANHO_11": "11cm",
      "TAMANHO_12": "12cm",
      "TAMANHO_13": "13cm",
      "TAMANHO_15": "15cm",
      "TAMANHO_17": "17cm"
    };
    return tamanhos[tamanho] || tamanho;
  };

  const getFormatoTexto = (formato) => {
    const formatos = {
      "CORACAO": "Coração",
      "CIRCULO": "Redondo",
      "QUADRADO": "Quadrado"
    };
    return formatos[formato] || formato;
  };

  const handleBackdropClick = (e) => {
    // Fechar apenas se clicar no backdrop (não nos elementos filhos)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black bg-opacity-60 flex justify-center items-center p-5 overflow-auto"
      onClick={handleBackdropClick}
    >
      <div className="flex gap-4 items-start flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="bg-bgHome border-2 border-gold rounded-xl w-[352px] h-[740px] flex flex-col shadow-xl overflow-hidden">
        <header className="bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] px-4 py-3 flex items-center justify-center rounded-t-xl relative">
          <h2 className="text-sm font-bold font-montserrat text-gold text-center">{nome}</h2>
          <button
            onClick={onClose}
            className="absolute right-3 text-white text-base font-bold hover:scale-105 transition-transform"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-bgHome border-2 border-gold m-2 rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-darkBlue">Carregando...</div>
            </div>
          ) : Object.keys(pedidosAgrupados).length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-gray-500">Nenhum pedido encontrado</div>
            </div>
          ) : (
            Object.entries(pedidosAgrupados).map(([tamanho, pedidos]) => (
              <div key={tamanho} className="mb-3">
                <h3 className="text-xs font-bold text-darkBlue mb-2 text-center">
                  Pedidos de {tipo} - Tamanho {getTamanhoTexto(tamanho)}
                </h3>
                <div className="space-y-2">
                  {pedidos.map((pedido, index) => (
                    <div
                      key={pedido.id || index}
                      className="bg-[#F6EFE4] border-2 border-gold rounded-xl p-3 flex items-start justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-darkBlue text-sm mb-1">
                          {pedido.nomeCliente || pedido.detalhes?.nomeCliente || "Cliente"}
                        </div>
                        <div className="text-xs text-darkBlue mb-0.5">
                          {formatarTelefone(pedido.telefone || pedido.detalhes?.telefone || "")}
                        </div>
                        <div className="text-xs text-darkBlue mb-0.5">
                          {pedido.tipoEntrega === "ENTREGA" ? "Entrega" : 
                           pedido.tipoEntrega === "RETIRADA" ? "Retirada" : 
                           pedido.detalhes?.tipoEntrega === "ENTREGA" ? "Entrega" :
                           pedido.detalhes?.tipoEntrega === "RETIRADA" ? "Retirada" : "Retirada"}
                        </div>
                        <div className="text-xs font-semibold text-darkBlue">
                          {formatarValor(pedido.valorTotal || pedido.valor || 0)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAbrirDetalhes(pedido)}
                        className={`group rounded-lg px-2.5 py-1.5 text-xs font-bold font-montserrat ml-2 flex-shrink-0 self-end transition-all duration-[2000ms] ease-in-out ${
                          pedidoAtivo === (pedido.id || pedido)
                            ? "bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] border border-gold"
                            : "bg-[#F6EFE4] border border-gold text-gold hover:bg-gradient-to-b hover:from-[#1C3B57] hover:to-[#0F2A3D] hover:border-gold"
                        }`}
                      >
                        <span className="relative inline-flex items-center justify-center min-h-[18px]">
                          {pedidoAtivo === (pedido.id || pedido) ? (
                            <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-opacity duration-[2000ms] ease-in-out">
                              <path fillRule="evenodd" clipRule="evenodd" d="M0.256188 0.207391C0.420275 0.0745985 0.642794 0 0.874813 0C1.10683 0 1.32935 0.0745985 1.49344 0.207391L5.86844 3.74906C6.03247 3.88189 6.12463 4.06202 6.12463 4.24985C6.12463 4.43767 6.03247 4.61781 5.86844 4.75064L1.49344 8.29231C1.32841 8.42134 1.10738 8.49273 0.877962 8.49112C0.64854 8.4895 0.429079 8.41501 0.266847 8.28368C0.104615 8.15235 0.0125917 7.97469 0.0105981 7.78897C0.00860451 7.60324 0.0968 7.42432 0.256188 7.29072L4.01256 4.24985L0.256188 1.20897C0.0921511 1.07614 0 0.896007 0 0.708182C0 0.520357 0.0921511 0.340223 0.256188 0.207391ZM5.50619 0.207391C5.67028 0.0745985 5.89279 0 6.12481 0C6.35683 0 6.57935 0.0745985 6.74344 0.207391L11.1184 3.74906C11.2825 3.88189 11.3746 4.06202 11.3746 4.24985C11.3746 4.43767 11.2825 4.61781 11.1184 4.75064L6.74344 8.29231C6.57841 8.42134 6.35738 8.49273 6.12796 8.49112C5.89854 8.4895 5.67908 8.41501 5.51685 8.28368C5.35461 8.15235 5.26259 7.97469 5.2606 7.78897C5.25861 7.60324 5.3468 7.42432 5.50619 7.29072L9.26256 4.24985L5.50619 1.20897C5.34215 1.07614 5.25 0.896007 5.25 0.708182C5.25 0.520357 5.34215 0.340223 5.50619 0.207391Z" fill={`url(#paint0_linear_${pedido.id || index})`}/>
                              <defs>
                                <linearGradient id={`paint0_linear_${pedido.id || index}`} x1="5.68731" y1="0" x2="5.68731" y2="8.49115" gradientUnits="userSpaceOnUse">
                                  <stop stopColor="#A47032"/>
                                  <stop offset="1" stopColor="#D4B076"/>
                                </linearGradient>
                              </defs>
                            </svg>
                          ) : (
                            <>
                              <span className="text-gold transition-all duration-[2000ms] ease-in-out group-hover:opacity-0 group-hover:scale-0 opacity-100 scale-100">Detalhes</span>
                              <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-[2000ms] ease-in-out" width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
                                <path fillRule="evenodd" clipRule="evenodd" d="M0.256188 0.207391C0.420275 0.0745985 0.642794 0 0.874813 0C1.10683 0 1.32935 0.0745985 1.49344 0.207391L5.86844 3.74906C6.03247 3.88189 6.12463 4.06202 6.12463 4.24985C6.12463 4.43767 6.03247 4.61781 5.86844 4.75064L1.49344 8.29231C1.32841 8.42134 1.10738 8.49273 0.877962 8.49112C0.64854 8.4895 0.429079 8.41501 0.266847 8.28368C0.104615 8.15235 0.0125917 7.97469 0.0105981 7.78897C0.00860451 7.60324 0.0968 7.42432 0.256188 7.29072L4.01256 4.24985L0.256188 1.20897C0.0921511 1.07614 0 0.896007 0 0.708182C0 0.520357 0.0921511 0.340223 0.256188 0.207391ZM5.50619 0.207391C5.67028 0.0745985 5.89279 0 6.12481 0C6.35683 0 6.57935 0.0745985 6.74344 0.207391L11.1184 3.74906C11.2825 3.88189 11.3746 4.06202 11.3746 4.24985C11.3746 4.43767 11.2825 4.61781 11.1184 4.75064L6.74344 8.29231C6.57841 8.42134 6.35738 8.49273 6.12796 8.49112C5.89854 8.4895 5.67908 8.41501 5.51685 8.28368C5.35461 8.15235 5.26259 7.97469 5.2606 7.78897C5.25861 7.60324 5.3468 7.42432 5.50619 7.29072L9.26256 4.24985L5.50619 1.20897C5.34215 1.07614 5.25 0.896007 5.25 0.708182C5.25 0.520357 5.34215 0.340223 5.50619 0.207391Z" fill={`url(#paint0_linear_hover_${pedido.id || index})`}/>
                                <defs>
                                  <linearGradient id={`paint0_linear_hover_${pedido.id || index}`} x1="5.68731" y1="0" x2="5.68731" y2="8.49115" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#A47032"/>
                                    <stop offset="1" stopColor="#D4B076"/>
                                  </linearGradient>
                                </defs>
                              </svg>
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        </div>

        {modalDetalhesOpen && (
          <div className="bg-bgNativeHome border-2 border-gold rounded-xl w-[800px] max-h-[740px] flex flex-col shadow-xl overflow-hidden">
            <header className="bg-gradient-blue border-b-2 border-gold px-6 py-4 flex items-center justify-between rounded-t-xl relative">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gold">
                  Número do Pedido: {pedidoSelecionado?.numeroPedido || pedidoSelecionado?.id || "9999999"}
                </h2>
                <h3 className="text-base font-thin text-white mt-1">
                  {detalhesPedido?.nomeProduto || "Bolo de Cenoura c/ cobertura de Chocolate"}
                </h3>
              </div>
              <button
                onClick={handleFecharDetalhes}
                className="text-red text-2xl font-bold hover:scale-105 transition-transform"
              >
                ✕
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar bg-bgNativeHome relative">
              {loadingDetalhes && (
                <div className="absolute inset-0 bg-bgNativeHome bg-opacity-50 flex items-center justify-center z-10 transition-opacity duration-300 pointer-events-none">
                  <div className="text-blue text-sm opacity-0">Carregando...</div>
                </div>
              )}
              {detalhesPedido || pedidoSelecionado ? (
                <div className={loadingDetalhes ? "opacity-60 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"}>
                <>
                  <div className="px-4 pt-4 pb-6 border-b border-[#FFC8B2]">
                    <h3 className="font-bold text-xl text-blue pb-4">Montagem</h3>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div>
                        <span className="text-blue font-semibold">Tamanho: </span>
                        <span className="text-blue">
                          {detalhesPedido?.tamanho ? getTamanhoTexto(detalhesPedido.tamanho) : "11cm"}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue font-semibold">Formato: </span>
                        <span className="text-blue">
                          {detalhesPedido?.formato ? getFormatoTexto(detalhesPedido.formato) : "Redondo"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-blue font-semibold">Massa</span>
                        <span className="text-blue break-words">{detalhesPedido?.massa || pedidoSelecionado?.detalhes?.massa || "Cacau Expresso"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-blue font-semibold">Recheio</span>
                        <span className="text-blue break-words">{detalhesPedido?.recheio || pedidoSelecionado?.detalhes?.recheio || "Brigadeiro de Pistache com Redução de Frutas Vermelhas"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pt-6 pb-6 border-b border-[#FFC8B2]">
                    <h3 className="font-bold text-xl text-blue pb-4">Decoração</h3>
                    <div className="text-blue italic">
                      {detalhesPedido?.imagensDecoracao && detalhesPedido.imagensDecoracao.length > 0
                        ? "Imagens de referência adicionadas"
                        : "Nenhuma imagem de referência adicionada"}
                    </div>
                  </div>

                  <div className="px-4 pt-6 pb-6 border-b border-[#FFC8B2]">
                    <h3 className="font-bold text-xl text-blue pb-4">Observações</h3>
                    <p className="text-blue break-words">
                      {detalhesPedido?.observacoes || detalhesPedido?.observacao || "Sem cobertura de chocolate"}
                    </p>
                  </div>

                  <div className="px-4 pt-6 pb-6 border-b border-[#FFC8B2]">
                    <h3 className="font-bold text-xl text-blue pb-4">Adicionais</h3>
                    <div className="flex flex-wrap gap-4">
                      {(() => {
                        let adicionaisList = [];
                        if (detalhesPedido?.adicionais) {
                          if (Array.isArray(detalhesPedido.adicionais)) {
                            adicionaisList = detalhesPedido.adicionais;
                          } else if (typeof detalhesPedido.adicionais === 'string') {
                            adicionaisList = detalhesPedido.adicionais.split(',').map(a => a.trim()).filter(Boolean);
                          } else if (typeof detalhesPedido.adicionais === 'object') {
                            adicionaisList = Object.keys(detalhesPedido.adicionais).filter(key => detalhesPedido.adicionais[key]);
                          }
                        }
                        return adicionaisList.length > 0 ? (
                          adicionaisList.map((adicional, index) => (
                          <div key={index} className="flex items-center gap-2 text-blue text-sm font-semibold">
                            <span
                              className="w-5 h-5 rounded-sm p-[1px]"
                              style={{
                                background: "linear-gradient(180deg, #A47032 0%, #D4B076 100%)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                className="w-full h-full rounded-[1px] flex items-center justify-center"
                                style={{
                                  background: "linear-gradient(180deg, #A47032 0%, #D4B076 100%)",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            </span>
                            {typeof adicional === 'string' ? adicional : adicional}
                          </div>
                        ))
                        ) : null;
                      })()}
                      {(!detalhesPedido?.adicionais || 
                        (Array.isArray(detalhesPedido.adicionais) && detalhesPedido.adicionais.length === 0) ||
                        (typeof detalhesPedido.adicionais === 'string' && detalhesPedido.adicionais.trim() === '') ||
                        (typeof detalhesPedido.adicionais === 'object' && Object.keys(detalhesPedido.adicionais).filter(key => detalhesPedido.adicionais[key]).length === 0)) && (
                        <>
                          <div className="flex items-center gap-2 text-blue text-sm font-semibold">
                            <span
                              className="w-5 h-5 rounded-sm p-[1px]"
                              style={{
                                background: "linear-gradient(180deg, #A47032 0%, #D4B076 100%)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                className="w-full h-full rounded-[1px] flex items-center justify-center"
                                style={{
                                  background: "linear-gradient(180deg, #A47032 0%, #D4B076 100%)",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            </span>
                            CEREJA
                          </div>
                          <div className="flex items-center gap-2 text-blue text-sm font-semibold">
                            <span
                              className="w-5 h-5 rounded-sm p-[1px]"
                              style={{
                                background: "linear-gradient(180deg, #A47032 0%, #D4B076 100%)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                className="w-full h-full rounded-[1px] flex items-center justify-center"
                                style={{
                                  background: "linear-gradient(180deg, #A47032 0%, #D4B076 100%)",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            </span>
                            GLITTER
                          </div>
                          <div className="flex items-center gap-2 text-blue text-sm font-semibold">
                            <span
                              className="w-5 h-5 rounded-sm p-[1px]"
                              style={{
                                background: "linear-gradient(180deg, #A47032 0%, #D4B076 100%)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                className="w-full h-full rounded-[1px] flex items-center justify-center"
                                style={{
                                  background: "linear-gradient(180deg, #A47032 0%, #D4B076 100%)",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            </span>
                            PEROLADO
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pt-6 pb-6 border-b border-[#FFC8B2]">
                    <h3 className="font-bold text-xl text-blue pb-4">Dados da Entrega</h3>
                    <div className="grid grid-cols-2 gap-y-4 text-blue">
                      <div>
                        <span className="font-semibold">O pedido será: </span>
                        <span>
                          {pedidoSelecionado?.tipoEntrega === "ENTREGA" ? "Entrega" : pedidoSelecionado?.tipoEntrega === "RETIRADA" ? "Retirada" : "Entrega"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Data: </span>
                        <span>
                          {pedidoSelecionado?.data ? formatarData(pedidoSelecionado.data) : "99/99"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pt-6 pb-6 border-b border-[#FFC8B2]">
                    <h3 className="font-bold text-xl text-blue pb-4">Dados do Solicitante</h3>
                    <div className="grid grid-cols-2 gap-y-4 text-blue">
                      <div>
                        <span className="font-semibold">Nome solicitante: </span>
                        <span className="break-words">{pedidoSelecionado?.nomeCliente || "Murilo Do Nascimento Barros"}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Telefone: </span>
                        <span>{formatarTelefoneCompleto(pedidoSelecionado?.telefone) || "(XX) X XXXX-XXXX"}</span>
                      </div>
                    </div>
                  </div>

                  {pedidoSelecionado?.tipoEntrega === "ENTREGA" && (
                    <div className="px-4 pt-6 pb-6">
                      <h3 className="font-bold text-xl text-blue pb-4">Endereço</h3>
                      <div className="grid grid-cols-3 gap-y-4 text-blue mb-4">
                        <div>
                          <span className="font-semibold">CEP: </span>
                          <span>{formatarCep(pedidoSelecionado?.cep) || "00000-00"}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Estado: </span>
                          <span>{pedidoSelecionado?.estado || "SP"}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Cidade: </span>
                          <span className="break-words">{pedidoSelecionado?.cidade || "São Paulo"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 text-blue">
                        <div>
                          <span className="font-semibold">Bairro: </span>
                          <span className="break-words">{pedidoSelecionado?.bairro || "Jardim Guairaca"}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Rua: </span>
                          <span className="break-words">{pedidoSelecionado?.rua || "Rua Antônio Marques Julião"}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Número: </span>
                          <span>{pedidoSelecionado?.numero || "9999"}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Complemento: </span>
                          <span className="break-words">{pedidoSelecionado?.complemento || "Inserir seu endereço"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
                </div>
              ) : (
                <div className="flex items-center justify-center py-10">
                  <div className="text-blue">Carregando...</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
