import { axiosApi } from '../provider/AxiosApi.js';

const orderSummary = async () => {
    try {
        if (token && token.trim() !== '') {
            try {
                const response = await axiosApi.get('/resumo-pedido');
                return response.data;
            } catch (authError) {
                console.warn("Erro com autenticação, tentando sem token:", authError);
            }
        }
        const response = await axiosApi.get('/resumo-pedido');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o Resumo dos Pedidos:", error);
        throw error;
    }
}

export default orderSummary;