import { axiosApi } from '../provider/AxiosApi.js';

const orderSummary = async () => {
    try {
        const response = await axiosApi.get('/resumo-pedido');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o Resumo dos Pedidos:", error);
        throw error;
    }
}

export default orderSummary;