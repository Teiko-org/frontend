import { axiosApi } from '../provider/AxiosApi.js';

export const orderSummaryStatusCancelado = async (id) => {
    try {
        const response = await axiosApi.patch(
            `/resumo-pedido/${id}/cancelado`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem('JWT_TOKEN')}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao mudar o status do Pedido para Cancelado:", error);
    }
};

export const orderSummaryStatusPendente = async (id) => {
    try {
        const response = await axiosApi.patch(
            `/resumo-pedido/${id}/pendente`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem('JWT_TOKEN')}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao mudar o status do Pedido para Pendente:", error);
    }
};

export const orderSummaryStatusPago = async (id) => {
    try {
        const response = await axiosApi.patch(
            `/resumo-pedido/${id}/pago`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem('JWT_TOKEN')}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao mudar o status do Pedido para Pago:", error);
    }
};

export const orderSummaryStatusConcluido = async (id) => {
    try {
        const response = await axiosApi.patch(
            `/resumo-pedido/${id}/concluido`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem('JWT_TOKEN')}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao mudar o status do Pedido para Concluído:", error);
    }
};