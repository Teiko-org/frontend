import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { MdWarning } from "react-icons/md";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import HeaderDashboard from "../../components/headerDashboard";
import ModalPedidosPendentes from "../../components/ModalPedidosPendentes";
import {
  getPedidosPendentesPorMassa,
  getPedidosPendentesPorRecheio,
  getPedidosProximosEntrega,
  getMassasMaisPedidasPorMes,
} from "../../service/producaoService";
import { formatBrazilianPhone } from "../../utils/phoneValidation";

const ClipboardIcon = () => (
  <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_2754_3574)">
      <path d="M8.75 19.7916H17.5V22.4304H8.75V19.7916ZM8.75 14.5138H21.25V17.1527H8.75V14.5138ZM8.75 9.236H21.25V11.8749H8.75V9.236ZM23.75 3.95822H18.525C18 2.42767 16.625 1.31934 15 1.31934C13.375 1.31934 12 2.42767 11.475 3.95822H6.25C6.075 3.95822 5.9125 3.97142 5.75 4.011C5.2625 4.11656 4.825 4.38045 4.4875 4.7367C4.2625 4.9742 4.075 5.26447 3.95 5.58114C3.825 5.88461 3.75 6.22767 3.75 6.59711V25.0693C3.75 25.4256 3.825 25.7818 3.95 26.0985C4.075 26.4152 4.2625 26.6923 4.4875 26.9429C4.825 27.2992 5.2625 27.5631 5.75 27.6686C5.9125 27.695 6.075 27.7082 6.25 27.7082H23.75C25.125 27.7082 26.25 26.5207 26.25 25.0693V6.59711C26.25 5.14572 25.125 3.95822 23.75 3.95822ZM15 3.62836C15.5125 3.62836 15.9375 4.07697 15.9375 4.61795C15.9375 5.15892 15.5125 5.60753 15 5.60753C14.4875 5.60753 14.0625 5.15892 14.0625 4.61795C14.0625 4.07697 14.4875 3.62836 15 3.62836ZM23.75 25.0693H6.25V6.59711H23.75V25.0693Z" fill="#323232"/>
    </g>
    <defs>
      <clipPath id="clip0_2754_3574">
        <rect width="30" height="31.6667" rx="8" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export default function Producao() {
  const [massasPendentes, setMassasPendentes] = useState([]);
  const [recheiosPendentes, setRecheiosPendentes] = useState([]);
  const [pedidosProximos, setPedidosProximos] = useState([]);
  const [dadosGrafico, setDadosGrafico] = useState({
    labels: [],
    serie: [],
    massaSelecionada: "Cacau Expresso"
  });
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [tipoGrafico, setTipoGrafico] = useState("Massas");
  const [loading, setLoading] = useState(true);
  const [modalPedidosOpen, setModalPedidosOpen] = useState(false);
  const [modalPedidosData, setModalPedidosData] = useState({ tipo: "", nome: "", pedidosIds: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        
        // Timeout de segurança de 15 segundos
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout ao carregar dados')), 15000)
        );
        
        const [massas, recheios, pedidos, grafico] = await Promise.race([
          Promise.all([
            getPedidosPendentesPorMassa().catch(() => []),
            getPedidosPendentesPorRecheio().catch(() => []),
            getPedidosProximosEntrega(7).catch(() => []),
            getMassasMaisPedidasPorMes(anoSelecionado, tipoGrafico).catch(() => ({
              labels: [],
              serie: [],
              massaSelecionada: tipoGrafico === "Massas" ? "Cacau Expresso" : tipoGrafico === "Recheios" ? "Brigadeiro" : "Decoração"
            })),
          ]),
          timeoutPromise
        ]).catch(() => [[], [], [], {
          labels: [],
          serie: [],
          massaSelecionada: tipoGrafico === "Massas" ? "Cacau Expresso" : tipoGrafico === "Recheios" ? "Brigadeiro" : "Decoração"
        }]);
        
        setMassasPendentes(massas);
        setRecheiosPendentes(recheios);
        setPedidosProximos(pedidos);
        setDadosGrafico(grafico);
      } catch (error) {
        console.warn("Erro ao carregar dados de produção:", error);
        // Garantir que os estados sejam definidos mesmo em caso de erro
        setMassasPendentes([]);
        setRecheiosPendentes([]);
        setPedidosProximos([]);
        setDadosGrafico({
          labels: [],
          serie: [],
          massaSelecionada: tipoGrafico === "Massas" ? "Cacau Expresso" : tipoGrafico === "Recheios" ? "Brigadeiro" : "Decoração"
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [anoSelecionado, tipoGrafico]);

  const formatarData = (dataString) => {
    if (!dataString) return "Data não disponível";
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return "Data inválida";
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const ano = String(data.getFullYear()).slice(-2);
      return `${dia}/${mes}/${ano}`;
    } catch (error) {
      return "Data inválida";
    }
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return "";
    return formatBrazilianPhone(telefone) || telefone;
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  const handleVerPedidos = (pedidosIds, tipo, nome) => {
    setModalPedidosData({ tipo, nome, pedidosIds });
    setModalPedidosOpen(true);
  };

  const handleVerDetalhes = (pedidoId) => {
    navigate("/dashboard-kanban-pedidos");
  };

  const totalMassasPendentes = massasPendentes.reduce((sum, m) => sum + m.quantidade, 0);
  const totalRecheiosPendentes = recheiosPendentes.reduce((sum, r) => sum + r.quantidade, 0);

  const coresBarras = useMemo(() => {
    return dadosGrafico.labels.map((_, index) => (index % 2 === 0 ? "#1C3B57" : "#D4B076"));
  }, [dadosGrafico.labels]);

  const graficoOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          borderRadius: 6,
          borderRadiusApplication: "end",
          distributed: true,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: dadosGrafico.labels,
        labels: {
          style: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            colors: "#666",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            colors: "#666",
          },
          formatter: function (val) {
            return val + " pedidos";
          },
        },
      },
      colors: coresBarras,
      legend: {
        show: false,
      },
      tooltip: {
        enabled: true,
        theme: "light",
        style: {
          fontSize: "12px",
          fontFamily: "Montserrat, sans-serif",
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const label = w.globals.labels[dataPointIndex];
          const valor = series[seriesIndex][dataPointIndex];
          const cor = coresBarras[dataPointIndex] || "#1C3B57";
          return `
            <div style="padding: 14px; background: white; border: 1px solid ${cor}; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); min-width: 140px;">
              <div style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 14px;">${label}</div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 12px; height: 12px; background: ${cor}; border-radius: 50%;"></div>
                <div style="color: #666; font-size: 14px; font-weight: 500;">${valor} pedidos</div>
              </div>
            </div>
          `;
        },
      },
      grid: {
        borderColor: "#f1f1f1",
        strokeDashArray: 3,
      },
    }),
    [dadosGrafico.labels, coresBarras]
  );

  const serieGrafico = useMemo(() => {
    if (dadosGrafico.serie.length === 0) {
      return [{ name: dadosGrafico.massaSelecionada, data: [] }];
    }
    return dadosGrafico.serie;
  }, [dadosGrafico.serie, dadosGrafico.massaSelecionada]);

  return (
    <div className="flex flex-row min-h-[100vh] pb-5 overflow-auto bg-bgNativeHome">
      <BarraLateralDashboard />
      <div className="w-full h-full flex flex-col items-center pl-56">
        <header className="pb-5 w-full">
          <HeaderDashboard title={"Produção"} />
        </header>

        {loading ? (
          <div className="w-[92%] flex justify-center items-center py-20">
            <div className="text-gold text-xl">Carregando...</div>
          </div>
        ) : (
          <>
            <div className="w-[92%] grid grid-cols-3 gap-4 mb-6">
              <div className="bg-bgHome border-2 border-gold rounded-xl p-3 shadow">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardIcon />
                  <h3 className="text-base font-bold text-darkBlue">Massas - Pedidos Pendentes</h3>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {massasPendentes.length === 0 ? (
                    <div className="text-gray-500 text-sm">Nenhum pedido pendente</div>
                  ) : (
                    massasPendentes.map((massa, index) => (
                      <div key={index} className="bg-[#FFEEE7] border-2 border-gold rounded-xl p-3 flex flex-col justify-between min-h-[80px]">
                        <div className="font-semibold text-darkBlue mb-4">{massa.nome}</div>
                        <div className="flex items-center justify-between mt-auto">
                          <button
                            onClick={() => handleVerPedidos(massa.pedidos, "Massa", massa.nome)}
                            className="bg-white border border-gold rounded-lg px-3 py-1 text-sm font-bold text-gold font-montserrat hover:bg-bgNativeHome transition-colors"
                          >
                            Ver pedidos
                          </button>
                          <div className="text-sm text-gray-600">x{massa.quantidade} Pedidos Pendentes</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-bgHome border-2 border-gold rounded-xl p-3 shadow">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardIcon />
                  <h3 className="text-base font-bold text-darkBlue">Recheios - Pedidos Pendentes</h3>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {recheiosPendentes.length === 0 ? (
                    <div className="text-gray-500 text-sm">Nenhum pedido pendente</div>
                  ) : (
                    recheiosPendentes.map((recheio, index) => (
                      <div key={index} className="bg-[#FFEEE7] border-2 border-gold rounded-xl p-3 flex flex-col justify-between min-h-[80px]">
                        <div className="font-semibold text-darkBlue mb-4">{recheio.nome}</div>
                        <div className="flex items-center justify-between mt-auto">
                          <button
                            onClick={() => handleVerPedidos(recheio.pedidos, "Recheio", recheio.nome)}
                            className="bg-white border border-gold rounded-lg px-3 py-1 text-sm font-bold text-gold font-montserrat hover:bg-bgNativeHome transition-colors"
                          >
                            Ver pedidos
                          </button>
                          <div className="text-sm text-gray-600">x{recheio.quantidade} Pedidos Pendentes</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-bgHome border-2 border-gold rounded-xl p-3 shadow">
                <div className="flex items-center gap-2 mb-3">
                  <MdWarning className="text-black text-xl" />
                  <h3 className="text-base font-bold text-darkBlue">Pedidos Próximos da Data de Entrega</h3>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {pedidosProximos.length === 0 ? (
                    <div className="text-gray-500 text-sm">Nenhum pedido próximo da entrega</div>
                  ) : (
                    pedidosProximos.slice(0, 5).map((pedido) => (
                      <div key={pedido.id} className="bg-[#FFEEE7] border border-gold rounded-xl p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-darkBlue">{pedido.nomeCliente || "Cliente"}</div>
                          <div className="bg-red rounded-full px-2 py-1 flex items-center gap-1">
                            <MdWarning className="text-white text-xs" />
                            <span className="text-sm text-white font-semibold">{formatarData(pedido.dataEntrega)}</span>
                          </div>
                        </div>
                        <div className="text-sm text-darkBlue mb-1">{formatarTelefone(pedido.telefone)}</div>
                        <div className="text-sm text-darkBlue mb-1">{pedido.tipoEntrega || "Retirada"}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold text-darkBlue">{formatarValor(pedido.valorTotal)}</span>
                          <button
                            onClick={() => handleVerDetalhes(pedido.id)}
                            className="bg-white border border-gold rounded-lg px-3 py-1 text-sm font-bold text-gold font-montserrat hover:bg-bgNativeHome transition-colors"
                          >
                            Detalhes
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {pedidosProximos.length > 5 && (
                  <button
                    onClick={() => navigate("/dashboard-kanban-pedidos")}
                    className="mt-4 w-full bg-white border border-gold rounded-lg px-3 py-2 text-sm font-bold text-gold font-montserrat hover:bg-bgNativeHome transition-colors"
                  >
                    Ver Outros {pedidosProximos.length - 5} Pedidos
                  </button>
                )}
              </div>
            </div>

            <div className="w-[92%] border-2 border-gold rounded-xl overflow-hidden mb-6">
              <div className="bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] text-gold px-5 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xl font-bold tracking-wide">
                      {tipoGrafico === "Massas" ? "Massas" : tipoGrafico === "Recheios" ? "Recheios" : "Decorações"} Mais Pedidas Por Mês - {anoSelecionado}
                    </div>
                    <div className="text-lg font-bold text-gold mt-2">
                      {dadosGrafico.massaSelecionada && `Item mais pedido: ${dadosGrafico.massaSelecionada.toUpperCase()}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="bg-bgHome text-darkBlue px-3 py-1 rounded-full border-2 border-gold shadow"
                      value={tipoGrafico}
                      onChange={(e) => setTipoGrafico(e.target.value)}
                    >
                      <option value="Massas">Massas</option>
                      <option value="Recheios">Recheios</option>
                    </select>
                    <select
                      className="bg-bgHome text-darkBlue px-3 py-1 rounded-full border-2 border-gold shadow"
                      value={anoSelecionado}
                      onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((ano) => (
                        <option key={ano} value={ano}>{ano}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-2 mt-3 flex items-start gap-2">
                  <MdWarning className="text-yellow-600 text-lg flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800 font-semibold">
                    <strong>⚠️ ATENÇÃO:</strong> Este gráfico mostra apenas <strong>UMA {tipoGrafico === "Massas" ? "MASSA" : "RECHEIO"}</strong> específica ({dadosGrafico.massaSelecionada || "selecionada automaticamente"}) ao longo dos meses do ano {anoSelecionado}. 
                    Não representa todos os itens, apenas o item mais pedido.
                  </div>
                </div>
              </div>
              <div className="bg-bgHome p-6 min-h-[400px]">
                {dadosGrafico.labels.length > 0 ? (
                  <ReactApexChart
                    options={graficoOptions}
                    series={serieGrafico}
                    type="bar"
                    height={340}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[340px] text-gray-500">
                    Nenhum dado disponível para o período selecionado
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <ModalPedidosPendentes
          isOpen={modalPedidosOpen}
          onClose={() => setModalPedidosOpen(false)}
          tipo={modalPedidosData.tipo}
          nome={modalPedidosData.nome}
          pedidosIds={modalPedidosData.pedidosIds}
        />
      </div>
    </div>
  );
}

