import { axiosApi } from '../provider/AxiosApi.js';

const orderCakeDetails = async (id) => {
    try {
        const response = await axiosApi.get(`/resumo-pedido/pedido-bolo/detalhe/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Detalhes do Pedido de Bolo:", error);
        throw error;
    }
};


export default orderCakeDetails;