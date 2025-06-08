import { axiosApi } from '../provider/AxiosApi.js';

const fornadaService = async (data) => {

    try {
        const response = await axiosApi.post('/fornadas', {
            headers: {Authorization: (`Bearer ${localStorage.getItem('JWT_TOKEN')}`)},
            dataInicio: data.dataInicio,
            dataFim: data.dataFim
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar Fornada:", error);
    }

}

export default fornadaService;