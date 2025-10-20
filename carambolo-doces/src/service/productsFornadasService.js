import { axiosApi } from '../provider/AxiosApi.js';

export const productsFornadasService = async () => {
    try {
        const response = await axiosApi.get('/fornadas/produto-fornada');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os produtos da Fornada:", error);
        return [];
    }
}

export const productsThisFornadasService = async (idFornada) => {
    try {
        const response = await axiosApi.get(`/fornadas/da-vez/produtos/${idFornada}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os produtos da Fornada:", error);
        return [];
    }
}