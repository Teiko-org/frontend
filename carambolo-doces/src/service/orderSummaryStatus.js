import { axiosApi } from '../provider/AxiosApi.js';

// Helper function para fazer requisições com token tratado
const makeAuthenticatedRequest = async (method, url, data = {}) => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('JWT_TOKEN') : null;
        
        const config = {
            ...data
        };

        // Adiciona token de autenticação se disponível
        if (token && token.trim() !== '') {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            };
        }

        const response = await axiosApi[method](url, config);
        return response.data;
    } catch (error) {
        console.error(`❌ Erro na requisição ${method.toUpperCase()} ${url}:`, error);
        throw error;
    }
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
        console.error("❌ Erro ao mudar o status do Pedido para Pendente:", error);
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