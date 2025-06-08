import { axiosApi } from '../provider/AxiosApi.js';

const fornadaService = async (data) => {

    console.log(data);
    try {
        const response = await axiosApi.post('/fornadas', {
            dataInicio: data.dataInicio,
            dataFim: data.dataFim
        },
            {
                headers: { Authorization: (`Bearer ${localStorage.getItem('JWT_TOKEN')}`) }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar Fornada:", error);
    }

}

export default fornadaService;