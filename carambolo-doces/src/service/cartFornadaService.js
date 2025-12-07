import { axiosApi } from "../provider/AxiosApi";
import { getProdutoFornadaById } from "./fornadaService";

export async function listResumoFornadaDoUsuario() {
  const userId = localStorage.getItem("userId");
  if (!userId) return [];

  try {
    // Busca resumos apenas de fornada
    const resumosResp = await axiosApi.get("/resumo-pedido/pedido-fornada", {
      timeout: 5000 // Timeout de 5 segundos
    });
    
    // Se retornar 204 (No Content), não há resumos
    if (resumosResp.status === 204 || !resumosResp.data) {
      return [];
    }
    
    const resumos = Array.isArray(resumosResp.data) ? resumosResp.data : [];
    
    if (resumos.length === 0) {
      return [];
    }

    // Para cada resumo, valida se o pedido pertence ao usuário
    // Limita a 20 pedidos para evitar muitas chamadas
    const resumosLimitados = resumos.slice(0, 20);
    
    const pedidos = await Promise.allSettled(
      resumosLimitados.map(async (r) => {
        try {
          const pedidoResp = await axiosApi.get(`/fornadas/pedidos/${r.pedidoFornadaId}`, {
            timeout: 3000 // Timeout de 3 segundos por pedido
          });
          const p = pedidoResp.data;
          if (p?.usuario === Number(userId)) {
            return { resumo: r, pedido: p };
          }
        } catch (error) {
          console.warn(`Erro ao buscar pedido ${r.pedidoFornadaId}:`, error.message);
        }
        return null;
      })
    );

    // Filtra apenas os que foram resolvidos com sucesso e não são null
    return pedidos
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);
  } catch (error) {
    console.error("Erro ao buscar resumos de pedidos de fornada:", error.message);
    return [];
  }
}

export async function aumentarQuantidadePedido(pedidoFornadaId) {
  // Pega detalhes do pedido para achar fornadaDaVez e data
  const pedidoResp = await axiosApi.get(`/fornadas/pedidos/${pedidoFornadaId}`);
  const pedido = pedidoResp.data;

  // Verifica estoque disponível na fornada
  const produto = await getProdutoFornadaById(pedido.fornadaDaVez);
  if (!produto || produto.quantidade <= 0) {
    return { ok: false, motivo: "indisponivel" };
  }

  const novoValor = Number(pedido.quantidade || 0) + 1;
  await axiosApi.put(`/fornadas/pedidos/${pedidoFornadaId}`, {
    quantidade: novoValor,
    dataPrevisaoEntrega: pedido.dataPrevisaoEntrega,
  });
  return { ok: true };
}

export async function diminuirQuantidadePedido(pedidoFornadaId) {
  const pedidoResp = await axiosApi.get(`/fornadas/pedidos/${pedidoFornadaId}`);
  const pedido = pedidoResp.data;
  const novoValor = Math.max(1, Number(pedido.quantidade || 1) - 1);
  await axiosApi.put(`/fornadas/pedidos/${pedidoFornadaId}`, {
    quantidade: novoValor,
    dataPrevisaoEntrega: pedido.dataPrevisaoEntrega,
  });
  return { ok: true };
}


