import { axiosApi } from '../provider/AxiosApi.js';

const orderFornadaDetails = async (id) => {
    try {
        const response = await axiosApi.get(`/resumo-pedido/pedido-fornada/detalhe/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Detalhes do Pedido de Fornada:", error);
        throw error;
    }
};


export default orderFornadaDetails;