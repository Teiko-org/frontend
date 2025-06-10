import { axiosApi } from '../provider/AxiosApi.js';

    const orderCake = async (id) => {
        try {

            const response = await axiosApi.get(`/bolos/${id}`)

                return response.data;

            } catch (error) {
            console.error("Erro ao buscar Pedido Bolo:", error);
        }
    };


export default orderCake;