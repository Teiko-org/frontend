import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import HeaderDashboard from "../../components/headerDashboard";
import {
  getQtdClientesUnicos,
  getQtdPedidosTotal,
  getProdutosMaisPedidos,
  getUltimosPedidos,
  getQtdPedidosBoloPorPeriodo,
  getQtdPedidosFornadaPorPeriodo,
} from "../../service/dashboardService";

export default function Dashboard() {
  const [kpis, setKpis] = useState({ pedidos: 0, clientes: 0 });
  const [pedidosStatus, setPedidosStatus] = useState({});
  const [topProdutos, setTopProdutos] = useState([]);
  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [periodo, setPeriodo] = useState("mes");
  const [tabProdutos, setTabProdutos] = useState("Todos");
  const [serieBolo, setSerieBolo] = useState({ labels: [], concluidos: [], cancelados: [] });
  const [serieFornada, setSerieFornada] = useState({ labels: [], concluidos: [], cancelados: [] });

  useEffect(() => {
    const load = async () => {
      const [clientes, pedidos, produtos, ultimos] = await Promise.all([
        getQtdClientesUnicos().catch(() => 0),
        getQtdPedidosTotal().catch(() => ({})),
        getProdutosMaisPedidos().catch(() => []),
        getUltimosPedidos().catch(() => []),
      ]);
      setKpis({ pedidos: pedidos?.total ?? 0, clientes: clientes ?? 0 });
      setPedidosStatus(pedidos ?? {});
      setTopProdutos(produtos ?? []);
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
        const labels = Object.keys(obj ?? {}).sort();
        const concluidos = labels.map((k) => obj[k]?.concluidos ?? 0);
        const cancelados = labels.map((k) => obj[k]?.cancelados ?? 0);
        return { labels, concluidos, cancelados };
      };
      setSerieBolo(parse(bolo));
      setSerieFornada(parse(fornada));
    };
    loadSeries();
  }, [periodo]);

  // Sparkline para os cards KPI
  const sparkOptions = useMemo(
    () => ({
      chart: { type: "area", sparkline: { enabled: true } },
      stroke: { width: 2, curve: "smooth" },
      tooltip: { enabled: false },
      colors: ["#C3A36A"],
    }),
    []
  );

  const pedidosSerieSpark = useMemo(() => [{ data: serieBolo.concluidos.slice(-10) }], [serieBolo]);
  const clientesSerieSpark = useMemo(() => [{ data: serieFornada.concluidos.slice(-10) }], [serieFornada]);

  // Gráfico principal (Pedidos)
  const pedidosOptions = useMemo(
    () => ({
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: "45%", borderRadius: 6 } },
      dataLabels: { enabled: false },
      xaxis: { categories: serieBolo.labels },
      colors: ["#D4B076", "#1C3B57"],
      legend: { position: "top" },
    }),
    [serieBolo.labels]
  );

  const produtosFiltrados = useMemo(() => {
    if (tabProdutos === "Todos") return topProdutos;
    if (tabProdutos === "Carambolos") return topProdutos.filter((p) => p.tipo === "BOLO");
    return topProdutos.filter((p) => p.tipo === "FORNADA");
  }, [tabProdutos, topProdutos]);

  return (
    <div className="flex flex-row min-h-[100vh] pb-5 overflow-auto bg-bgNativeHome">
      <BarraLateralDashboard />
      <div className="w-full h-full flex flex-col items-center pl-56">
        <header className="pb-5 w-full">
          <HeaderDashboard title={"Dashboard"} />
        </header>

        {/* KPI Cards */}
        <div className="w-[92%] grid grid-cols-3 gap-6">
          <div className="bg-bgHome border-2 border-gold rounded-xl p-3 shadow gradient-border">
            <div className="text-xs">Pedidos</div>
            <div className="text-2xl font-bold">{kpis.pedidos || 0}</div>
            <div className="mt-2">
              <ReactApexChart options={sparkOptions} series={pedidosSerieSpark} type="area" height={60} />
            </div>
          </div>
          <div className="bg-bgHome border-2 border-gold rounded-xl p-3 shadow gradient-border">
            <div className="text-xs">Pedidos</div>
            <div className="text-2xl font-bold">{kpis.pedidos || 0}</div>
            <div className="mt-2">
              <ReactApexChart options={sparkOptions} series={pedidosSerieSpark} type="area" height={60} />
            </div>
          </div>
          <div className="bg-bgHome border-2 border-gold rounded-xl p-3 shadow gradient-border">
            <div className="text-xs">Clientes</div>
            <div className="text-2xl font-bold">{kpis.clientes || 0}</div>
            <div className="mt-2">
              <ReactApexChart options={sparkOptions} series={clientesSerieSpark} type="area" height={60} />
            </div>
          </div>
        </div>

        {/* Bloco Pedidos com cabeçalho azul */}
        <div className="w-[92%] mt-6 mb-6 border-2 border-gold rounded-xl overflow-hidden">
          <div className="bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] text-gold px-5 py-3 flex items-center justify-between">
            <div>
              <div className="text-xl font-bold tracking-wide">Pedidos</div>
              <div className="text-[11px] opacity-90">Acompanhe o pulso das vendas em tempo real.</div>
            </div>
            <select className="bg-bgHome text-darkBlue px-3 py-1 rounded-full border-2 border-gold shadow" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
              <option value="mes">Mês</option>
              <option value="ano">Ano</option>
            </select>
          </div>
          <div className="bg-bgHome p-4 min-h-[320px]">
            <ReactApexChart
              options={pedidosOptions}
              series={[
                { name: "Bolo", data: serieBolo.concluidos },
                { name: "Fornada", data: serieFornada.concluidos },
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
            <div className="p-3">
              <div className="grid grid-cols-4 text-xs font-semibold border-b border-gold pb-2">
                <div>Imagem</div>
                <div>Nome</div>
                <div className="text-center">Quantidade</div>
                <div className="text-right">Valor</div>
              </div>
              <div className="max-h-52 overflow-auto">
                {produtosFiltrados.map((p) => (
                  <div key={`${p.tipo}-${p.id}`} className="grid grid-cols-4 items-center py-2 border-b border-gold/40 text-sm">
                    <div>
                      <img src="src/assets/image_card.png" alt="produto" className="w-12 h-12 object-cover rounded" />
                    </div>
                    <div className="pr-2 truncate">{p.nome}</div>
                    <div className="text-center">{p.quantidade}</div>
                    <div className="text-right">R${Number(p.valorTotal || 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Principais Clientes */}
          <div className="col-span-3 border-2 border-gold rounded-xl overflow-hidden bg-bgHome self-start">
            <div className="bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] text-gold px-5 py-3">
              <div className="text-xl font-bold tracking-wide">Principais Clientes</div>
              <div className="text-[11px] opacity-90">Quem mais confia no nosso sabor.</div>
            </div>
            <div className="p-3 text-sm">
              {(() => {
                const map = new Map();
                ultimosPedidos.forEach((p) => {
                  const key = p.telefoneDoCliente || p.nomeDoCliente;
                  map.set(key, (map.get(key) || 0) + 1);
                });
                const arr = Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
                return arr.length ? (
                  arr.map(([k, v]) => (
                    <div key={k} className="border border-gold/40 rounded-lg p-3 mb-2">
                      <div className="font-semibold">{k}</div>
                      <div className="text-xs">Total de Pedidos: {v}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500">Sem dados</div>
                );
              })()}
            </div>
          </div>

          {/* Últimos Pedidos */}
          <div className="col-span-3 border-2 border-gold rounded-xl overflow-hidden bg-bgHome self-start">
            <div className="bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] text-gold px-5 py-3">
              <div className="text-xl font-bold tracking-wide">Últimos Pedidos</div>
              <div className="text-[11px] opacity-90">Pedidos que acabaram de sair do forno.</div>
            </div>
            <div className="p-3 text-sm">
              {ultimosPedidos.slice(0, 5).map((p) => (
                <div key={p.id} className="border border-gold/40 rounded-lg p-3 mb-2">
                  <div className="font-semibold truncate">{p.nomeDoCliente}</div>
                  <div className="text-xs">{p.telefoneDoCliente}</div>
                  <div className="text-xs">{p.tipoProduto === "FORNADA" ? "Retirada" : String(p.tipoDoPedido || "").toLowerCase()}</div>
                  <div className="text-xs font-semibold">R${Number(p.valorPedido).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


