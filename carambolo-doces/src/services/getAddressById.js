import { axiosApi } from '../provider/AxiosApi.js';

const getAddressById = async ({id}) => {
    try {
        const response = await axiosApi.get(`/enderecos/${id}`)

        return response.data;

    } catch (error) {
        console.error("Erro ao buscar Endereço:", error);
    }
}

export default getAddressById;