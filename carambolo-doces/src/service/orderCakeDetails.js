import { axiosApi } from '../provider/AxiosApi.js';

const orderCakeDetails = async (id) => {
    try {

        const response = await axiosApi.get(`/resumo-pedido/pedido-bolo/detalhe/${id}`, {
            headers: { Authorization: (`Bearer ${localStorage.getItem('JWT_TOKEN')}`) }
        });

        return response.data;

    } catch (error) {

        console.error("Erro ao buscar Detalhes do Pedido de Bolo:", error);

    }
};


export default orderCakeDetails;