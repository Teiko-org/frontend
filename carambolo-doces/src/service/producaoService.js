import { axiosApi } from "../provider/AxiosApi";

/**
 * Busca massas pendentes usando o endpoint do backend
 * Retorna: [{ massaId, nomeMassa, quantidade, pedidos: [ids] }]
 */
export async function getPedidosPendentesPorMassa() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('JWT_TOKEN') : null;
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    const response = await axiosApi.get('/dashboard/massas-pendentes', config);
    
    if (response.status === 204 || !response.data || response.data.length === 0) {
      return [];
    }
    
    // Buscar IDs dos pedidos para cada massa
    const massasComPedidos = await Promise.all(
      response.data.map(async (massa) => {
        try {
          // Buscar pedidos por massa com status PENDENTE ou PAGO (que ainda precisam ser produzidos)
          // Como o endpoint não suporta múltiplos status, vamos buscar ambos e combinar
          const [pendentesResponse, pagosResponse] = await Promise.all([
            axiosApi.get(`/resumo-pedido/pedido-bolo/por-massa/${massa.massaId}?status=PENDENTE`, config)
              .then(res => res.status === 204 ? { data: [] } : res)
              .catch(() => ({ data: [] })),
            axiosApi.get(`/resumo-pedido/pedido-bolo/por-massa/${massa.massaId}?status=PAGO`, config)
              .then(res => res.status === 204 ? { data: [] } : res)
              .catch(() => ({ data: [] }))
          ]);
          
          // Combinar arrays e remover duplicatas baseado no ID
          const pendentes = Array.isArray(pendentesResponse.data) ? pendentesResponse.data : [];
          const pagos = Array.isArray(pagosResponse.data) ? pagosResponse.data : [];
          const todosPedidos = [...pendentes, ...pagos];
          
          // Remover duplicatas baseado no ID
          const pedidosUnicos = todosPedidos.filter((pedido, index, self) => 
            pedido && pedido.id && index === self.findIndex(p => p && p.id === pedido.id)
          );
          
          const pedidosIds = pedidosUnicos.map(p => p.id).filter(Boolean);
          
          return {
            massaId: massa.massaId,
            nome: massa.nomeMassa || "Massa Desconhecida",
            quantidade: massa.quantidade || 0,
            pedidos: pedidosIds
          };
        } catch (error) {
          console.warn(`Erro ao buscar pedidos da massa ${massa.massaId}:`, error);
          return {
            massaId: massa.massaId,
            nome: massa.nomeMassa || "Massa Desconhecida",
            quantidade: massa.quantidade || 0,
            pedidos: []
          };
        }
      })
    );
    
    return massasComPedidos;
  } catch (error) {
    console.warn("Erro ao buscar pedidos pendentes por massa:", error.response?.status || error.message);
    return [];
  }
}

/**
 * Busca recheios pendentes usando o endpoint do backend
 * Retorna: [{ recheioId, nomeRecheio, quantidade, pedidos: [ids] }]
 */
export async function getPedidosPendentesPorRecheio() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('JWT_TOKEN') : null;
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    const response = await axiosApi.get('/dashboard/recheios-pendentes', config);
    
    if (response.status === 204 || !response.data || response.data.length === 0) {
      return [];
    }
    
    // Buscar IDs dos pedidos para cada recheio
    const recheiosComPedidos = await Promise.all(
      response.data.map(async (recheio) => {
        try {
          // Buscar pedidos por recheio com status PENDENTE ou PAGO (que ainda precisam ser produzidos)
          // Como o endpoint não suporta múltiplos status, vamos buscar ambos e combinar
          const [pendentesResponse, pagosResponse] = await Promise.all([
            axiosApi.get(`/resumo-pedido/pedido-bolo/por-recheio/${recheio.recheioId}?status=PENDENTE`, config)
              .then(res => res.status === 204 ? { data: [] } : res)
              .catch(() => ({ data: [] })),
            axiosApi.get(`/resumo-pedido/pedido-bolo/por-recheio/${recheio.recheioId}?status=PAGO`, config)
              .then(res => res.status === 204 ? { data: [] } : res)
              .catch(() => ({ data: [] }))
          ]);
          
          // Combinar arrays e remover duplicatas baseado no ID
          const pendentes = Array.isArray(pendentesResponse.data) ? pendentesResponse.data : [];
          const pagos = Array.isArray(pagosResponse.data) ? pagosResponse.data : [];
          const todosPedidos = [...pendentes, ...pagos];
          
          // Remover duplicatas baseado no ID
          const pedidosUnicos = todosPedidos.filter((pedido, index, self) => 
            pedido && pedido.id && index === self.findIndex(p => p && p.id === pedido.id)
          );
          
          const pedidosIds = pedidosUnicos.map(p => p.id).filter(Boolean);
          
          return {
            recheioId: recheio.recheioId,
            nome: recheio.nomeRecheio || "Recheio Desconhecido",
            quantidade: recheio.quantidade || 0,
            pedidos: pedidosIds
          };
        } catch (error) {
          console.warn(`Erro ao buscar pedidos do recheio ${recheio.recheioId}:`, error);
          return {
            recheioId: recheio.recheioId,
            nome: recheio.nomeRecheio || "Recheio Desconhecido",
            quantidade: recheio.quantidade || 0,
            pedidos: []
          };
        }
      })
    );
    
    return recheiosComPedidos;
  } catch (error) {
    console.warn("Erro ao buscar pedidos pendentes por recheio:", error.response?.status || error.message);
    return [];
  }
}

/**
 * Busca pedidos próximos da data de entrega usando o endpoint do backend
 * Retorna: [{ resumoPedidoId, nomeCliente, telefoneCliente, dataEntrega, valor, status, tipoProduto, ... }]
 */
export async function getPedidosProximosEntrega(diasProximos = 7) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('JWT_TOKEN') : null;
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    const response = await axiosApi.get(
      `/dashboard/pedidos-proximos-entrega?diasProximos=${diasProximos}`,
      config
    );
    
    if (response.status === 204 || !response.data || response.data.length === 0) {
      return [];
    }
    
    // Mapear dados do backend para o formato esperado pelo frontend
    return response.data.map((pedido) => ({
      id: pedido.resumoPedidoId || pedido.id,
      nomeCliente: pedido.nomeCliente || "Cliente",
      telefone: pedido.telefoneCliente || pedido.telefone || "",
      tipoEntrega: pedido.tipoEntrega || "Retirada",
      valorTotal: pedido.valor || 0,
      dataEntrega: pedido.dataEntrega || pedido.dataPrevisaoEntrega || null,
      status: pedido.status || "PENDENTE",
      tipoProduto: pedido.tipoProduto || "BOLO",
      pedidoBoloId: pedido.pedidoBoloId,
      pedidoFornadaId: pedido.pedidoFornadaId
    }));
  } catch (error) {
    console.warn("Erro ao buscar pedidos próximos da entrega:", error.response?.status || error.message);
    return [];
  }
}

/**
 * Busca itens mais pedidos por período usando o endpoint do backend
 * Suporta Massas, Recheios e Decorações
 * Retorna dados formatados para o gráfico ApexCharts
 */
export async function getMassasMaisPedidasPorMes(ano = 2025, tipoItem = "MASSA") {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('JWT_TOKEN') : null;
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    // Converter tipoItem do frontend para o formato do backend
    const tipoItemBackend = tipoItem === "Massas" ? "MASSA" : 
                           tipoItem === "Recheios" ? "RECHEIO" : 
                           tipoItem === "Decorações" ? "DECORACAO" : "MASSA";
    
    const response = await axiosApi.get(
      `/dashboard/itens-mais-pedidos-por-periodo?tipoItem=${tipoItemBackend}&periodo=MES&ano=${ano}`,
      config
    );
    
    if (response.status === 204 || !response.data || response.data.length === 0) {
      return {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        serie: [],
        massaSelecionada: tipoItem === "Massas" ? "Cacau Expresso" : tipoItem === "Recheios" ? "Brigadeiro" : "Decoração"
      };
    }
    
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const mesesNumeros = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    
    // Agrupar dados por item e mês
    const dadosPorItem = {};
    
    response.data.forEach((item) => {
      const nomeItem = item.nomeItem || "Desconhecido";
      const periodo = item.periodo || "";
      
      // Extrair mês do período (formato: "2025-01" do backend)
      let mesIndex = -1;
      if (periodo.includes("-")) {
        const partes = periodo.split("-");
        if (partes.length >= 2) {
          const mesNumero = partes[1];
          mesIndex = mesesNumeros.indexOf(mesNumero);
        }
      } else if (periodo.length === 2) {
        mesIndex = mesesNumeros.indexOf(periodo);
      }
      
      // Validar se o período corresponde ao ano selecionado
      if (periodo.includes("-")) {
        const anoPeriodo = parseInt(periodo.split("-")[0]);
        if (anoPeriodo !== ano) {
          return; // Ignorar períodos de outros anos
        }
      }
      
      // Aceitar todos os meses de 1 a 12 (0-11 no índice)
      if (mesIndex >= 0 && mesIndex < 12) {
        if (!dadosPorItem[nomeItem]) {
          dadosPorItem[nomeItem] = new Array(12).fill(0);
        }
        dadosPorItem[nomeItem][mesIndex] = (dadosPorItem[nomeItem][mesIndex] || 0) + (item.quantidade || 0);
      }
    });
    
    // Encontrar o item mais pedido (soma de todos os meses)
    const itemMaisPedido = Object.keys(dadosPorItem).reduce((maior, item) => {
      const totalMaior = dadosPorItem[maior]?.reduce((sum, val) => sum + val, 0) || 0;
      const totalItem = dadosPorItem[item]?.reduce((sum, val) => sum + val, 0) || 0;
      return totalItem > totalMaior ? item : maior;
    }, Object.keys(dadosPorItem)[0] || (tipoItem === "Massas" ? "Cacau Expresso" : tipoItem === "Recheios" ? "Brigadeiro" : "Decoração"));
    
    // Criar série para o gráfico (todos os 12 meses)
    const serie = dadosPorItem[itemMaisPedido] || new Array(12).fill(0);
    
    return {
      labels: meses.slice(0, 12),
      serie: [{
        name: itemMaisPedido,
        data: serie
      }],
      massaSelecionada: itemMaisPedido
    };
  } catch (error) {
    console.warn("Erro ao buscar itens mais pedidos por mês:", error.response?.status || error.message);
    return {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      serie: [],
      massaSelecionada: tipoItem === "Massas" ? "Cacau Expresso" : tipoItem === "Recheios" ? "Brigadeiro" : "Decoração"
    };
  }
}

