import { axiosApi } from '../provider/AxiosApi.js';

// Helper function para fazer requisições com token tratado
const makeAuthenticatedRequest = async (method, url, data = {}) => {
    const response = await axiosApi[method](url, data);
    return response.data;
};

export const orderSummaryStatusCancelado = async (id) => {
    try {
        return await makeAuthenticatedRequest('patch', `/resumo-pedido/${id}/cancelado`, {});
    } catch (error) {
        console.error("Erro ao mudar o status do Pedido para Cancelado:", error);
        throw error;
    }
};

export const orderSummaryStatusPendente = async (id) => {
    try {
        return await makeAuthenticatedRequest('patch', `/resumo-pedido/${id}/pendente`, {});
    } catch (error) {
        console.error("Erro ao mudar o status do Pedido para Pendente:", error);
        throw error;
    }
};

export const orderSummaryStatusPago = async (id) => {
    try {
        return await makeAuthenticatedRequest('patch', `/resumo-pedido/${id}/pago`, {});
    } catch (error) {
        console.error("Erro ao mudar o status do Pedido para Pago:", error);
        throw error;
    }
};

export const orderSummaryStatusConcluido = async (id) => {
    try {
        return await makeAuthenticatedRequest('patch', `/resumo-pedido/${id}/concluido`, {});
    } catch (error) {
        console.error("Erro ao mudar o status do Pedido para Concluído:", error);
        throw error;
    }
};