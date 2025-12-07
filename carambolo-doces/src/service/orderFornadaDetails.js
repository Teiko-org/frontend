import { axiosApi } from '../provider/AxiosApi.js';

const orderFornadaDetails = async (id) => {
    try {
        // Timeout aumentado para 30 segundos devido à complexidade das queries
        const response = await axiosApi.get(`/resumo-pedido/pedido-fornada/detalhe/${id}`, {
            timeout: 30000
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Detalhes do Pedido de Fornada:", error);
        throw error;
    }
};


export default orderFornadaDetails;