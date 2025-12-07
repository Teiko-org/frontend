import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import HeaderDashboard from "../../components/headerDashboard";
import PrincipaisClientes from "../../components/PrincipaisClientes";
import UltimosPedidos from "../../components/UltimosPedidos";
import { axiosApi } from "../../provider/AxiosApi";
import {
  getQtdClientesUnicos,
  getQtdPedidosTotal,
  getQtdPedidosBolo,
  getQtdPedidosFornada,
  getProdutosMaisPedidos,
  getUltimosPedidos,
  getQtdPedidosBoloPorPeriodo,
  getQtdPedidosFornadaPorPeriodo,
} from "../../service/dashboardService";

export default function Dashboard() {
  const [kpis, setKpis] = useState({ pedidosBolo: 0, pedidosFornada: 0, clientes: 0 });
  const [pedidosStatus, setPedidosStatus] = useState({});
  const [topProdutos, setTopProdutos] = useState([]);
  const [topProdutosImgs, setTopProdutosImgs] = useState([]);
  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [periodo, setPeriodo] = useState("mes");
  const [tipoGrafico, setTipoGrafico] = useState("Bolo");
  const [tabProdutos, setTabProdutos] = useState("Todos");
  const [serieBolo, setSerieBolo] = useState({ labels: [], concluidos: [], cancelados: [] });
  const [serieFornada, setSerieFornada] = useState({ labels: [], concluidos: [], cancelados: [] });

  useEffect(() => {
    const load = async () => {
      const [clientes, pedidosBolo, pedidosFornada, produtos, ultimos] = await Promise.all([
        getQtdClientesUnicos().catch(() => 0),
        getQtdPedidosBolo().catch(() => ({})),
        getQtdPedidosFornada().catch(() => ({})),
        getProdutosMaisPedidos().catch(() => []), // Estatísticas de pedidos - correto para dashboard
        getUltimosPedidos().catch(() => []),
      ]);
      setKpis({ 
        pedidosBolo: pedidosBolo?.total ?? 0, 
        pedidosFornada: pedidosFornada?.total ?? 0, 
        clientes: clientes ?? 0 
      });
      setPedidosStatus({ bolo: pedidosBolo ?? {}, fornada: pedidosFornada ?? {} });
      const lista = produtos ?? [];
      setTopProdutos(lista);
      try {
        const enriquecidos = await Promise.all(
          (lista || []).map(async (p) => {
            try {
              if (p?.tipo === "FORNADA") {
                const { data } = await axiosApi.get(`/fornadas/produto-fornada/${p.id}`);
                const imagens = data?.imagens ?? data?.imagens?.map?.((i) => i?.url) ?? [];
                const url = Array.isArray(imagens) && imagens.length > 0 ? (imagens[0]?.url ?? imagens[0]) : undefined;
                return { ...p, imagemUrl: url };
              }
              if (p?.tipo === "BOLO") {
                const { data: bolo } = await axiosApi.get(`/bolos/${p.id}`);
                const decoracaoId = bolo?.decoracaoId;
                if (decoracaoId) {
                  const { data: decoracao } = await axiosApi.get(`/decoracoes/${decoracaoId}`);
                  const url = decoracao?.imagens?.[0];
                  return { ...p, imagemUrl: url };
                }
                return { ...p, imagemUrl: undefined };
              }
              return { ...p };
            } catch {
              return { ...p };
            }
          })
        );
        setTopProdutosImgs(enriquecidos);
      } catch {
        setTopProdutosImgs(lista);
      }
      setUltimosPedidos(ultimos ?? []);
    };
    load();
  }, []);

  useEffect(() => {
    const loadSeries = async () => {
      const [bolo, fornada] = await Promise.all([
        getQtdPedidosBoloPorPeriodo(periodo).catch(() => ({})),
        getQtdPedidosFornadaPorPeriodo(periodo).catch(() => ({})),
      ]);
      const parse = (obj) => {
        const rawLabels = Object.keys(obj ?? {});
        const sorted = rawLabels.sort((a, b) => Number(a) - Number(b));
        const concluidos = sorted.map((k) => (obj?.[k]?.concluidos ?? 0));
        const cancelados = sorted.map((k) => (obj?.[k]?.cancelados ?? 0));

        const formattedLabels = periodo === "mes"
          ? sorted.map((label) => {
              const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
              const monthNum = parseInt(label);
              return monthNames[monthNum - 1] || String(label);
            })
          : sorted.map((l) => String(l));

        return { labels: periodo === 'mes' ? sorted.map((l)=>String(l)) : sorted.map((l)=>String(l)), concluidos, cancelados, displayLabels: formattedLabels };
      };
      const parsedBolo = parse(bolo);
      const parsedFornada = parse(fornada);
      setSerieBolo({ labels: parsedBolo.labels, concluidos: parsedBolo.concluidos, cancelados: parsedBolo.cancelados });
      setSerieFornada({ labels: parsedFornada.labels, concluidos: parsedFornada.concluidos, cancelados: parsedFornada.cancelados });
    };
    loadSeries();
  }, [periodo]);

  const buildSparkOptions = (labels, isAno) => ({
    chart: { 
      type: "area", 
      sparkline: { enabled: true },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    stroke: { width: 3, curve: "smooth" },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    tooltip: { 
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Montserrat, sans-serif'
      },
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const label = w.globals.labels[dataPointIndex];
        const valor = series[seriesIndex][dataPointIndex];
        let titulo = label;
        if (!isAno) {
          const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          const mesNome = monthNames[parseInt(label) - 1] || label;
          titulo = mesNome;
        }
        return `
          <div style="padding: 10px 14px; background: white; border: 1px solid #D4B076; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.15); min-width: 100px;">
            <div style="font-weight: 600; color: #333; margin-bottom: 6px; font-size: 13px;">${titulo}</div>
            <div style="color: #666; font-size: 14px; font-weight: 500;">${valor} pedidos</div>
          </div>
        `;
      }
    },
    colors: ["#C3A36A"],
    grid: { show: false },
    xaxis: { categories: labels.slice(-10), labels: { show: false } },
    yaxis: { show: false }
  });

  const sparkOptionsBolo = useMemo(() => buildSparkOptions(serieBolo.labels, periodo === 'ano'), [serieBolo.labels, periodo]);
  const sparkOptionsFornada = useMemo(() => buildSparkOptions(serieFornada.labels, periodo === 'ano'), [serieFornada.labels, periodo]);

  const pedidosSerieSpark = useMemo(() => [{ data: (serieBolo.concluidos || []).slice(-10) }], [serieBolo.concluidos]);
  const fornadaSerieSpark = useMemo(() => [{ data: (serieFornada.concluidos || []).slice(-10) }], [serieFornada.concluidos]);

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const categoriesDisplay = useMemo(() => {
    const labels = tipoGrafico === 'Bolo' ? (serieBolo.labels || []) : (serieFornada.labels || []);
    if (periodo === 'mes') {
      return labels.map((l) => monthNames[parseInt(l) - 1] || String(l));
    }
    return labels.map((l) => String(l));
  }, [tipoGrafico, serieBolo.labels, serieFornada.labels, periodo]);

  const serieConcluidos = useMemo(() => (
    tipoGrafico === 'Bolo' ? (serieBolo.concluidos || []) : (serieFornada.concluidos || [])
  ), [tipoGrafico, serieBolo.concluidos, serieFornada.concluidos]);

  const serieCancelados = useMemo(() => (
    tipoGrafico === 'Bolo' ? (serieBolo.cancelados || []) : (serieFornada.cancelados || [])
  ), [tipoGrafico, serieBolo.cancelados, serieFornada.cancelados]);

  const pedidosOptions = useMemo(
    () => ({
      chart: { 
        type: "bar", 
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          }
        }
      },
      plotOptions: { 
        bar: { 
          columnWidth: "45%", 
          borderRadius: 6,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last'
        } 
      },
      dataLabels: { enabled: false },
      xaxis: { 
        categories: categoriesDisplay,
        labels: {
          style: {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '12px',
            colors: '#666'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '12px',
            colors: '#666'
          },
          formatter: function(val) {
            return val + " pedidos"
          }
        }
      },
      colors: ["#D4B076", "#1C3B57"],
      legend: { 
        position: "top",
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        markers: {
          width: 8,
          height: 8,
          radius: 4
        }
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'Montserrat, sans-serif'
        },
        custom: function({series, seriesIndex, dataPointIndex, w}) {
          const label = w.globals.labels[dataPointIndex];
          const valor = series[seriesIndex][dataPointIndex];
          const serieNome = seriesIndex === 0 ? 'Concluídos' : 'Cancelados';
          const cor = seriesIndex === 0 ? '#D4B076' : '#1C3B57';

          return `
            <div style="padding: 14px; background: white; border: 1px solid ${cor}; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); min-width: 140px;">
              <div style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 14px;">${label}</div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 12px; height: 12px; background: ${cor}; border-radius: 50%;"></div>
                <div style="color: #666; font-size: 14px; font-weight: 500;">${valor} ${serieNome} (${tipoGrafico})</div>
              </div>
            </div>
          `;
        }
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
      }
    }),
    [categoriesDisplay, periodo, tipoGrafico]
  );

  const produtosFiltrados = useMemo(() => {
    const base = topProdutosImgs?.length ? topProdutosImgs : topProdutos;
    if (tabProdutos === "Todos") return base;
    if (tabProdutos === "Carambolos") return base.filter((p) => p.tipo === "BOLO");
    return base.filter((p) => p.tipo === "FORNADA");
  }, [tabProdutos, topProdutos, topProdutosImgs]);

  return (
    <div className="flex flex-row min-h-[100vh] pb-5 overflow-auto bg-bgNativeHome">
      <BarraLateralDashboard />
      <div className="w-full h-full flex flex-col items-center pl-56">
        <header className="pb-5 w-full">
          <HeaderDashboard title={"Dashboard"} />
        </header>

        {/* KPI Cards */}
        <div className="w-[92%] grid grid-cols-3 gap-6">
          <div className="bg-bgHome border-2 border-gold rounded-xl p-4 shadow gradient-border hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600 font-medium">Pedidos de Bolo</div>
              <div className="w-3 h-3 bg-gradient-to-r from-[#D4B076] to-[#A47032] rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{kpis.pedidosBolo || 0}</div>
            <div className="text-xs text-gray-500 mb-3">{periodo === 'ano' ? 'Tendência dos últimos anos' : 'Tendência dos últimos meses'}</div>
            <div className="mt-2">
              <ReactApexChart options={sparkOptionsBolo} series={pedidosSerieSpark} type="area" height={60} />
            </div>
          </div>
          <div className="bg-bgHome border-2 border-gold rounded-xl p-4 shadow gradient-border hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600 font-medium">Pedidos de Fornada</div>
              <div className="w-3 h-3 bg-gradient-to-r from-[#1C3B57] to-[#0F2A3D] rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{kpis.pedidosFornada || 0}</div>
            <div className="text-xs text-gray-500 mb-3">{periodo === 'ano' ? 'Tendência dos últimos anos' : 'Tendência dos últimos meses'}</div>
            <div className="mt-2">
              <ReactApexChart options={sparkOptionsFornada} series={fornadaSerieSpark} type="area" height={60} />
            </div>
          </div>
          <div className="bg-bgHome border-2 border-gold rounded-xl p-4 shadow gradient-border hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600 font-medium">Clientes Únicos</div>
              <div className="w-3 h-3 bg-gradient-to-r from-[#C3A36A] to-[#A47032] rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{kpis.clientes || 0}</div>
            <div className="text-xs text-gray-500 mb-3">Clientes únicos cadastrados</div>
            <div className="mt-2">
              <ReactApexChart options={sparkOptionsFornada} series={fornadaSerieSpark} type="area" height={60} />
            </div>
          </div>
        </div>

        {/* Bloco Pedidos com cabeçalho azul */}
        <div className="w-[92%] mt-6 mb-6 border-2 border-gold rounded-xl overflow-hidden">
          <div className="bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] text-gold px-5 py-3 flex items-center justify-between">
            <div>
              <div className="text-xl font-bold tracking-wide">Pedidos</div>
              <div className="text-[11px] opacity-90">Concluídos x Cancelados · Filtrar por tipo</div>
            </div>
            <div className="flex items-center gap-2">
              <select className="bg-bgHome text-darkBlue px-3 py-1 rounded-full border-2 border-gold shadow" value={tipoGrafico} onChange={(e) => setTipoGrafico(e.target.value)}>
                <option value="Bolo">Bolo</option>
                <option value="Fornada">Fornada</option>
              </select>
              <select className="bg-bgHome text-darkBlue px-3 py-1 rounded-full border-2 border-gold shadow" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                <option value="mes">Mês</option>
                <option value="ano">Ano</option>
              </select>
            </div>
          </div>
          <div className="bg-bgHome p-4 min-h-[320px]">
            <ReactApexChart
              options={pedidosOptions}
              series={[
                { name: "Concluídos", data: serieConcluidos },
                { name: "Cancelados", data: serieCancelados },
              ]}
              type="bar"
              height={260}
            />
          </div>
        </div>

        {/* Seção inferior: produtos + clientes + últimos pedidos */}
        <div className="w-[92%] grid grid-cols-12 gap-6">
          {/* Produtos mais pedidos */}
          <div className="col-span-6 border-2 border-gold rounded-xl overflow-hidden bg-bgHome shadow self-start">
            <div className="bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] text-gold px-5 py-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="text-xl font-bold tracking-wide">Produtos mais pedidos</div>
                <div className="text-[11px] opacity-90">O que a clientela ama pedir na Carambolos.</div>
              </div>
              {[
                { label: "Todos" },
                { label: "Carambolos" },
                { label: "Fornada" },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={() => setTabProdutos(b.label)}
                  className={`px-3 py-1 rounded-full text-xs transition-all button-animated ${
                    tabProdutos === b.label ? "bg-gradient-to-l from-gold to-darkGold text-blue border-2 border-gold shadow hover:shadow-md" : "bg-bgHome text-gold border-2 border-gold hover:bg-[#f6efe4]"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="p-3 h-80 flex flex-col">
              <div className="grid grid-cols-4 text-xs font-semibold border-b border-gold pb-2 flex-shrink-0">
                <div>Imagem</div>
                <div>Nome</div>
                <div className="text-center">Quantidade</div>
                <div className="text-center pr-6">Valor</div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar pr-3">
                {produtosFiltrados.map((p) => (
                  <div key={`${p.tipo}-${p.id}`} className="grid grid-cols-4 items-center py-2 border-b border-gold/40 text-sm">
                    <div>
                      <img
                        src={p.imagemUrl || "src/assets/image_card.png"}
                        alt={p.nome}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => { e.currentTarget.src = "src/assets/image_card.png"; }}
                      />
                    </div>
                    <div className="pr-2 truncate">{p.nome}</div>
                    <div className="text-center">{p.quantidade}</div>
                    <div className="text-right pr-6">R${Number(p.valorTotal || 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Principais Clientes */}
          <div className="col-span-3 self-start">
            <PrincipaisClientes />
          </div>

          {/* Últimos Pedidos */}
          <div className="col-span-3 self-start">
            <UltimosPedidos />
          </div>
        </div>
      </div>
    </div>
  );
}


