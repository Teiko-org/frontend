import { axiosApi } from "../provider/AxiosApi";
import orderSummary from "../services/orderSummary";
import orderCakeDetails from "./orderCakeDetails";

export async function getPedidosPendentesPorMassa() {
  try {
    const pedidos = await orderSummary();
    const pedidosPendentes = pedidos.filter((p) => p.status === "PENDENTE" && p.pedidoBoloId);
    
    const massasMap = {};
    
    for (const pedido of pedidosPendentes) {
      try {
        const detalhes = await orderCakeDetails(pedido.pedidoBoloId);
        const massaNome = detalhes.massa || "Não especificada";
        
        if (!massasMap[massaNome]) {
          massasMap[massaNome] = {
            nome: massaNome,
            quantidade: 0,
            pedidos: []
          };
        }
        massasMap[massaNome].quantidade += 1;
        massasMap[massaNome].pedidos.push(pedido.id);
      } catch (error) {
        console.warn("Erro ao buscar detalhes do pedido:", error);
      }
    }
    
    return Object.values(massasMap);
  } catch (error) {
    console.warn("Erro ao buscar pedidos pendentes por massa:", error.response?.status || error.message);
    return [];
  }
}

export async function getPedidosPendentesPorRecheio() {
  try {
    const pedidos = await orderSummary();
    const pedidosPendentes = pedidos.filter((p) => p.status === "PENDENTE" && p.pedidoBoloId);
    
    const recheiosMap = {};
    
    for (const pedido of pedidosPendentes) {
      try {
        const detalhes = await orderCakeDetails(pedido.pedidoBoloId);
        const recheioNome = detalhes.recheio || "Não especificado";
        
        if (!recheiosMap[recheioNome]) {
          recheiosMap[recheioNome] = {
            nome: recheioNome,
            quantidade: 0,
            pedidos: []
          };
        }
        recheiosMap[recheioNome].quantidade += 1;
        recheiosMap[recheioNome].pedidos.push(pedido.id);
      } catch (error) {
        console.warn("Erro ao buscar detalhes do pedido:", error);
      }
    }
    
    return Object.values(recheiosMap);
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
    const pedidos = await orderSummary();
    const pedidosBolo = pedidos.filter((p) => p.pedidoBoloId && p.status !== "CANCELADO");
    
    const dadosPorMes = {};
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    for (let mes = 0; mes < 12; mes++) {
      dadosPorMes[meses[mes]] = {};
    }
    
    for (const pedido of pedidosBolo) {
      try {
        const dataPedido = new Date(pedido.dataPedido);
        if (dataPedido.getFullYear() === ano) {
          const mesNome = meses[dataPedido.getMonth()];
          const detalhes = await orderCakeDetails(pedido.pedidoBoloId);
          const massaNome = detalhes.massa || "Não especificada";
          
          if (!dadosPorMes[mesNome][massaNome]) {
            dadosPorMes[mesNome][massaNome] = 0;
          }
          dadosPorMes[mesNome][massaNome] += 1;
        }
      } catch (error) {
        console.warn("Erro ao processar pedido para gráfico:", error);
      }
    }
    
    const massasUnicas = new Set();
    Object.values(dadosPorMes).forEach((mes) => {
      Object.keys(mes).forEach((massa) => massasUnicas.add(massa));
    });
    
    const massaMaisPedida = Array.from(massasUnicas).reduce((maior, massa) => {
      const total = Object.values(dadosPorMes).reduce((sum, mes) => sum + (mes[massa] || 0), 0);
      const totalMaior = Object.values(dadosPorMes).reduce((sum, mes) => sum + (mes[maior] || 0), 0);
      return total > totalMaior ? massa : maior;
    }, Array.from(massasUnicas)[0] || "Cacau Expresso");
    
    const serie = meses.slice(0, 11).map((mes) => dadosPorMes[mes][massaMaisPedida] || 0);
    
    return {
      labels: meses.slice(0, 11),
      serie: [{
        name: massaMaisPedida,
        data: serie
      }],
      massaSelecionada: massaMaisPedida
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
