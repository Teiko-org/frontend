import ColumnOrder from "../../components/ColumnOrder";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import orderSummary from "../../services/orderSummary";
import { useEffect, useState, useMemo } from "react";
import HeaderDashboard from "../../components/headerDashboard";
import "../../styles/kanban-drag-drop.css";
import {
  orderSummaryStatusCancelado,
  orderSummaryStatusConcluido,
  orderSummaryStatusPago,
  orderSummaryStatusPendente,
} from "../../service/orderSummaryStatus";

function OrderKanban() {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Paginação
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filtros
  const [filterMes, setFilterMes] = useState("");
  const [filterAno, setFilterAno] = useState("");
  const [filterTipo, setFilterTipo] = useState("");

  const getData = async () => {
    setIsLoading(true);
    try {
      // Se estiver filtrando por ano, buscar TODAS as páginas para garantir que encontramos todos os pedidos daquele ano
      if (filterAno) {
        // Primeiro, buscar a primeira página para saber quantas páginas existem
        const firstPage = await orderSummary(0, pageSize);
        const totalPagesAvailable = firstPage.totalPages || 1;
        
        console.log(`🔍 Buscando pedidos de ${filterAno} - Total de páginas:`, totalPagesAvailable);
        
        // Buscar todas as páginas (limitado a 100 páginas para não sobrecarregar)
        const promises = [];
        const maxPagesToFetch = Math.min(totalPagesAvailable, 100);
        for (let page = 0; page < maxPagesToFetch; page++) {
          promises.push(orderSummary(page, pageSize));
        }
        const responses = await Promise.all(promises);
        
        // Combinar todos os resultados
        const allOrders = [];
        responses.forEach(response => {
          if (Array.isArray(response.content)) {
            allOrders.push(...response.content);
          }
        });
        
        // Remover duplicatas por ID
        const uniqueOrders = Array.from(
          new Map(allOrders.map(order => [order.id, order])).values()
        );
        
        console.log(`🔍 Buscando pedidos de ${filterAno} - Total encontrado:`, uniqueOrders.length, "de", firstPage.totalElements || 0, "pedidos totais");
        
        setOrders(uniqueOrders);
        setTotalPages(totalPagesAvailable);
        setTotalElements(firstPage.totalElements || 0);
      } else {
        // Quando não há filtro de ano, usar paginação normal
        const response = await orderSummary(currentPage, pageSize);
        setOrders(Array.isArray(response.content) ? response.content : []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      }
    } catch (err) {
      console.error("❌ Erro ao buscar pedidos:", err);
      setOrders([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [refresh, pageSize, filterAno, filterMes, filterTipo, currentPage]);

  // Resetar página quando filtros mudarem (exceto quando apenas a página muda)
  useEffect(() => {
    setCurrentPage(0);
  }, [filterAno, filterMes, filterTipo]);

  // Recarregar quando a janela recebe foco ou quando um pedido é criado
  useEffect(() => {
    const handleFocus = () => {
      // Recarregar dados quando a janela recebe foco
      setRefresh(prev => !prev);
    };

    const handleVisibilityChange = () => {
      // Recarregar quando a aba fica visível novamente
      if (!document.hidden) {
        setRefresh(prev => !prev);
      }
    };

    const handlePedidoCriado = () => {
      // Recarregar quando um novo pedido é criado
      console.log("🆕 Novo pedido criado, recarregando lista...");
      setRefresh(prev => !prev);
      setCurrentPage(0);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pedidoCriado', handlePedidoCriado);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pedidoCriado', handlePedidoCriado);
    };
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    let previousStatus = null;
    try {
      setOrders((prevOrders) => {
        const updated = prevOrders.map((order) => {
          if (order.id === orderId) {
            previousStatus = order.status;
            return { ...order, status: newStatus };
          }
          return { ...order };
        });
        return updated;
      });

      if (newStatus === "CANCELADO") {
        await orderSummaryStatusCancelado(orderId);
      } else if (newStatus === "PENDENTE") {
        await orderSummaryStatusPendente(orderId);
      } else if (newStatus === "PAGO") {
        await orderSummaryStatusPago(orderId);
      } else if (newStatus === "CONCLUIDO") {
        await orderSummaryStatusConcluido(orderId);
      }

      setForceUpdate((prev) => prev + 1);
      await getData();
    } catch (error) {
      console.error(`❌ Erro ao alterar status do pedido ${orderId}:`, error);
      if (previousStatus) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: previousStatus } : order
          )
        );
      }
    }
  };

  // Helpers de leitura
  const getOrderDate = (o) => {
    // Tentar múltiplas propriedades de data, priorizando dataEntrega e dataPedido
    const raw = o?.dataEntrega || o?.data || o?.dataPedido || o?.createdAt || o?.created_at || o?.created_date;
    if (!raw) {
      return null;
    }
    
    // Tentar parsear a data de diferentes formas
    let d = null;
    
    // Se for string, tentar parsear
    if (typeof raw === 'string') {
      // Tentar parsear como ISO string
      d = new Date(raw);
      
      // Se falhar, tentar parsear como formato brasileiro (DD/MM/YYYY)
      if (isNaN(d.getTime())) {
        const parts = raw.split('/');
        if (parts.length === 3) {
          d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
      }
      
      // Se ainda falhar, tentar parsear como formato com hífen (YYYY-MM-DD)
      if (isNaN(d.getTime())) {
        const parts = raw.split('-');
        if (parts.length >= 3) {
          d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
      }
    } else if (raw instanceof Date) {
      d = raw;
    } else if (typeof raw === 'number') {
      d = new Date(raw);
    }
    
    if (!d || isNaN(d.getTime())) {
      return null;
    }
    
    return d;
  };

  const getOrderTipo = (o) => {
    if ((o?.pedidoFornadaId ?? 0) > 0 || (o?.fornadaId ?? 0) > 0) return "FORNADA";
    if ((o?.pedidoBoloId ?? 0) > 0 || (o?.caramboloId ?? 0) > 0) return "CARAMBOLO";
    return "DESCONHECIDO";
  };

  // Opções para selects - inclui anos dos pedidos + ano atual e próximo
  const anosDisponiveis = useMemo(() => {
    const set = new Set();
    const anoAtual = new Date().getFullYear();
    const proximoAno = anoAtual + 1;
    
    // Adiciona anos dos pedidos
    orders.forEach((o) => {
      const d = getOrderDate(o);
      if (d) set.add(d.getFullYear());
    });
    
    // Sempre inclui o ano atual e o próximo ano
    set.add(anoAtual);
    set.add(proximoAno);
    
    // Garante pelo menos os últimos 3 anos
    for (let i = 0; i < 3; i++) {
      set.add(anoAtual - i);
    }
    
    return Array.from(set).sort((a, b) => b - a);
  }, [orders]);

  // Aplicar filtros
  const filteredOrders = useMemo(() => {
    const filtered = orders.filter((o) => {
      const d = getOrderDate(o);
      const tipo = getOrderTipo(o);
      const okMes = filterMes ? (d && d.getMonth() + 1 === Number(filterMes)) : true;
      const okAno = filterAno ? (d && d.getFullYear() === Number(filterAno)) : true;
      const okTipo = filterTipo ? (tipo === filterTipo) : true;
      
      return okMes && okAno && okTipo;
    });
    
    // Debug: mostrar quantos pedidos foram encontrados quando filtrando por ano
    if (filterAno) {
      console.log(`📊 Filtro ${filterAno} - Total de pedidos carregados:`, orders.length, "Filtrados:", filtered.length);
      if (filtered.length === 0 && orders.length > 0) {
        const anosEncontrados = [...new Set(orders.map(o => {
          const d = getOrderDate(o);
          return d ? d.getFullYear() : 'sem data';
        }))].sort();
        console.log(`⚠️ Nenhum pedido de ${filterAno} encontrado. Anos disponíveis:`, anosEncontrados);
      }
    }
    
    return filtered;
  }, [orders, filterMes, filterAno, filterTipo]);

  // Determinar se deve mostrar paginação ou apenas texto
  const shouldShowPagination = useMemo(() => {
    // Se não há filtro de ano, sempre mostrar paginação
    if (!filterAno) {
      return true;
    }
    // Se há filtro de ano e muitos pedidos filtrados (>= 100), mostrar paginação
    // Caso contrário, mostrar apenas o texto
    return filteredOrders.length >= 100;
  }, [filterAno, filteredOrders.length]);

  // Calcular paginação local quando há filtro de ano e muitos pedidos
  const paginatedOrders = useMemo(() => {
    // Se não há filtro de ano, usar os pedidos diretamente (já vêm paginados da API)
    if (!filterAno) {
      return filteredOrders;
    }
    
    // Se há filtro de ano e muitos pedidos, paginar localmente
    if (shouldShowPagination) {
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      return filteredOrders.slice(startIndex, endIndex);
    }
    
    // Se há filtro de ano mas poucos pedidos, mostrar todos
    return filteredOrders;
  }, [filteredOrders, filterAno, shouldShowPagination, currentPage, pageSize]);

  // Calcular total de páginas para pedidos filtrados
  const filteredTotalPages = useMemo(() => {
    if (!filterAno || !shouldShowPagination) {
      return totalPages;
    }
    return Math.ceil(filteredOrders.length / pageSize);
  }, [filterAno, shouldShowPagination, filteredOrders.length, pageSize, totalPages]);

  return (
    <div className="flex bg-bgNativeHome h-screen overflow-hidden">
      <BarraLateralDashboard />

      <div className="w-full pl-56 flex flex-col h-screen overflow-hidden">
        <header className="pb-5 bg-bgNativeHome flex-shrink-0">
          <HeaderDashboard
            title={"Pedidos"}
            rightContent={
              <div className="flex items-center gap-2">
                <select
                  value={filterMes}
                  onChange={(e) => setFilterMes(e.target.value)}
                  className="bg-white text-black rounded-full px-3 py-2 min-w-[120px] border border-gold"
                >
                  <option value="" disabled>Mês</option>
                  <option value="1">Janeiro</option>
                  <option value="2">Fevereiro</option>
                  <option value="3">Março</option>
                  <option value="4">Abril</option>
                  <option value="5">Maio</option>
                  <option value="6">Junho</option>
                  <option value="7">Julho</option>
                  <option value="8">Agosto</option>
                  <option value="9">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </select>

                <select
                  value={filterAno}
                  onChange={(e) => setFilterAno(e.target.value)}
                  className="bg-white text-black rounded-full px-3 py-2 min-w-[110px] border border-gold"
                >
                  <option value="" disabled>Ano</option>
                  {anosDisponiveis.map((ano) => (
                    <option key={ano} value={ano}>{ano}</option>
                  ))}
                </select>

                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="bg-white text-black rounded-full px-3 py-2 min-w-[140px] border border-gold"
                >
                  <option value="" disabled>Tipo</option>
                  <option value="FORNADA">Fornada</option>
                  <option value="CARAMBOLO">Carambolo</option>
                </select>

                <button
                  type="button"
                  onClick={() => { setFilterMes(""); setFilterAno(""); setFilterTipo(""); }}
                  className="bg-gradient-to-l from-gold to-darkGold text-blue border border-gold rounded-full px-4 py-2"
                >
                  Limpar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRefresh(prev => !prev);
                    setCurrentPage(0);
                  }}
                  className="bg-gradient-to-l from-gold to-darkGold text-blue border border-gold rounded-full px-4 py-2 hover:opacity-80 transition-opacity"
                  title="Recarregar pedidos"
                >
                  Atualizar
                </button>
              </div>
            }
          />
        </header>

        <main className="flex-1 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex justify-center items-center py-20 flex-1">
              <div className="text-center">
                <p className="text-xl text-blue mb-4">Carregando pedidos...</p>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex justify-center items-center py-20 flex-1">
              <div className="text-center">
                <p className="text-xl text-blue mb-4">Nenhum pedido encontrado para esse filtro</p>
                {filterAno && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Se você acabou de criar um pedido, clique em "Atualizar" para recarregar.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setRefresh(prev => !prev);
                        setCurrentPage(0);
                      }}
                      className="bg-gradient-to-l from-gold to-darkGold text-blue border border-gold rounded-full px-4 py-2 hover:opacity-80 transition-opacity"
                    >
                      Atualizar Agora
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-evenly items-start gap-10 flex-1 p-6 kanban-columns-container">
              <ColumnOrder
                title="Pedidos Cancelados"
                orderFilter={paginatedOrders?.filter((item) => item.status === "CANCELADO")}
                status={"CANCELADO"}
                onStatusChange={handleStatusChange}
              />
              <ColumnOrder
                title="Pedidos Pendentes"
                orderFilter={paginatedOrders?.filter((item) => item.status === "PENDENTE")}
                status={"PENDENTE"}
                onStatusChange={handleStatusChange}
              />
              <ColumnOrder
                title="Pedidos Pagos"
                orderFilter={paginatedOrders?.filter((item) => item.status === "PAGO")}
                status={"PAGO"}
                onStatusChange={handleStatusChange}
              />
              <ColumnOrder
                title="Pedidos Concluídos"
                orderFilter={paginatedOrders?.filter((item) => item.status === "CONCLUIDO")}
                status={"CONCLUIDO"}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
        </main>

        {/* Footer de Paginação */}
        <footer className="bg-bgNativeHome border-t border-gold py-4 px-6 flex-shrink-0">
          <div className="flex items-center gap-3 justify-end">
            {/* Mostrar paginação quando não há filtro de ano OU quando há muitos pedidos filtrados */}
            {shouldShowPagination && (
              <>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="bg-white text-black rounded-full px-3 py-2 min-w-[100px] border border-gold"
                >
                  <option value="10">10 por página</option>
                  <option value="20">20 por página</option>
                  <option value="50">50 por página</option>
                  <option value="100">100 por página</option>
                </select>

                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="bg-gradient-to-l from-gold to-darkGold text-blue border border-gold rounded-full px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>

                <span className="text-blue font-semibold min-w-[120px] text-center">
                  Página {currentPage + 1} de {filteredTotalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(filteredTotalPages - 1, currentPage + 1))}
                  disabled={currentPage >= filteredTotalPages - 1}
                  className="bg-gradient-to-l from-gold to-darkGold text-blue border border-gold rounded-full px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima →
                </button>
              </>
            )}

            <span className="text-blue text-sm">
              {filterAno && !shouldShowPagination
                ? `Mostrando ${filteredOrders.length} pedidos de ${filterAno} (de ${totalElements} totais)`
                : `Total: ${filterAno ? filteredOrders.length : totalElements} pedidos`}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default OrderKanban;