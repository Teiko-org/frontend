import { axiosApi } from "../provider/AxiosApi";
import { getProdutoFornadaById } from "./fornadaService";

export async function listResumoFornadaDoUsuario() {
  const userId = localStorage.getItem("userId");
  if (!userId) return [];

  // Busca resumos apenas de fornada
  const resumosResp = await axiosApi.get("/resumo-pedido/pedido-fornada");
  const resumos = Array.isArray(resumosResp.data) ? resumosResp.data : [];

  // Para cada resumo, valida se o pedido pertence ao usuário
  const pedidos = await Promise.all(
    resumos.map(async (r) => {
      try {
        const pedidoResp = await axiosApi.get(`/fornadas/pedidos/${r.pedidoFornadaId}`);
        const p = pedidoResp.data;
        if (p?.usuario === Number(userId)) {
          return { resumo: r, pedido: p };
        }
      } catch (_) {
        // ignora erros individuais
      }
      return null;
    })
  );

  return pedidos.filter(Boolean);
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


