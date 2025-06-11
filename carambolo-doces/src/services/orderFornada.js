import { axiosApi } from '../provider/AxiosApi.js';

const orderFornada = async (id) => {
    try {
        const response = await axiosApi.get(`/fornadas/pedidos/${id}`)

        return response.data;

    } catch (error) {
        console.error("Erro ao buscar Pedido Fornada:", error);
    }
}

export default orderFornada;