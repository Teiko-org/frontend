import { axiosApi } from '../provider/AxiosApi.js';

const orderFornadaDetails = async (id) => {

    try {

        const response = await axiosApi.get(`/resumo-pedido/pedido-fornada/detalhe/${id}`, {
            headers: { Authorization: (`Bearer ${localStorage.getItem('JWT_TOKEN')}`) }
        });

        return response.data;

    } catch (error) {

        console.error("Erro ao buscar Detalhes do Pedido de Fornada:", error);

    }

};


export default orderFornadaDetails;