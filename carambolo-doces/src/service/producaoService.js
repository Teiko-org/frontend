import { axiosApi } from "../provider/AxiosApi";

export async function getPedidosPendentesPorMassa() {
  try {
    const response = await axiosApi.get("/producao/pedidos-pendentes-por-massa");
    return response.data || [];
  } catch (error) {
    console.warn("Erro ao buscar pedidos pendentes por massa:", error.response?.status || error.message);
    return [];
  }
}

export async function getPedidosPendentesPorRecheio() {
  try {
    const response = await axiosApi.get("/producao/pedidos-pendentes-por-recheio");
    return response.data || [];
  } catch (error) {
    console.warn("Erro ao buscar pedidos pendentes por recheio:", error.response?.status || error.message);
    return [];
  }
}

export async function getPedidosProximosEntrega() {
  try {
    const pedidos = await orderSummary();
    const hoje = new Date();
    const proximos7Dias = new Date();
    proximos7Dias.setDate(hoje.getDate() + 7);
    
    const pedidosProximos = pedidos.filter((p) => {
      if (!p.dataEntrega) return false;
      const dataEntrega = new Date(p.dataEntrega);
      return dataEntrega >= hoje && dataEntrega <= proximos7Dias && p.status !== "CANCELADO" && p.status !== "CONCLUIDO";
    });
    
    pedidosProximos.sort((a, b) => {
      const dataA = new Date(a.dataEntrega);
      const dataB = new Date(b.dataEntrega);
      return dataA - dataB;
    });
    
    return pedidosProximos.slice(0, 100);
  } catch (error) {
    console.warn("Erro ao buscar pedidos próximos da entrega:", error.response?.status || error.message);
    return [];
  }
}

export async function getMassasMaisPedidasPorMes(ano = 2025) {
  try {
    const response = await axiosApi.get(`/producao/massas-mais-pedidas-por-mes?ano=${ano}`);
    const data = response.data;
    
    // Converter o formato do backend para o formato esperado pelo frontend
    return {
      labels: data.labels || [],
      serie: data.serie?.map(s => ({
        name: s.name,
        data: s.data
      })) || [],
      massaSelecionada: data.massaSelecionada || "Cacau Expresso"
    };
  } catch (error) {
    console.warn("Erro ao buscar massas mais pedidas por mês:", error.response?.status || error.message);
    return {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro"],
      serie: [{ name: "Cacau Expresso", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
      massaSelecionada: "Cacau Expresso"
    };
  }
}

