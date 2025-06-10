import { axiosApi } from '../provider/AxiosApi.js';

export const insertNewFornada = async (data) => {
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

export const listFornadas = async () => {
    try {
        const response = await axiosApi.get("/fornadas");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getLastFornada = async () => {
    const fornadas = await listFornadas();
    const lastFornada = fornadas[fornadas.length - 1];
    return lastFornada;
}