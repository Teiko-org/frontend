import { axiosApi } from "../provider/AxiosApi";

export async function getQtdClientesUnicos() {
  const { data } = await axiosApi.get("/dashboard/qtdClientesUnicos");
  return data;
}

export async function getQtdPedidosTotal() {
  const { data } = await axiosApi.get("/dashboard/qtdPedidos");
  return data; // { total, concluídos, pagos, pendentes, cancelados }
}

export async function getProdutosMaisPedidos() {
  const { data } = await axiosApi.get("/dashboard/produtosMaisPedidos");
  return data;
}

export async function getUltimosPedidos() {
  const { data } = await axiosApi.get("/dashboard/ultimosPedidos");
  return data;
}

export async function getQtdPedidosBoloPorPeriodo(periodo) {
  const { data } = await axiosApi.get("/dashboard/qtdPedidosBoloPorPeriodo", {
    params: { periodo },
  });
  return data; // { label -> { cancelados, concluidos } }
}

export async function getQtdPedidosFornadaPorPeriodo(periodo) {
  const { data } = await axiosApi.get("/dashboard/qtdPedidosFornadaPorPeriodo", {
    params: { periodo },
  });
  return data; // { label -> { cancelados, concluidos } }
}

// KPIs específicos para fornadas
export async function getKPIFornada(fornadaId) {
  const { data } = await axiosApi.get(`/dashboard/kpi-fornada/${fornadaId}`);
  return data; // { quantidadeDisponivel, quantidadeVendida, totalDisponivel, totalVendido, valorPerdido, percentualVendido }
}

export async function getKPIFornadaMaisRecente() {
  const { data } = await axiosApi.get("/dashboard/kpi-fornada-mais-recente");
  return data; // { quantidadeDisponivel, quantidadeVendida, totalDisponivel, totalVendido, valorPerdido, percentualVendido }
}

export async function getKPIFornadasPorPeriodo(ano, mes) {
  const { data } = await axiosApi.get("/dashboard/kpi-fornadas-por-periodo", {
    params: { ano, mes },
  });
  return data; // { quantidadeDisponivel, quantidadeVendida, totalDisponivel, totalVendido, valorPerdido, percentualVendido, mes, ano }
}


