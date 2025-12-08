import { axiosApi } from '../provider/AxiosApi.js';

export const productsFornadasService = async (page = 0, size = 10) => {
    try {
        const response = await axiosApi.get('/fornadas/produto-fornada', {
            params: {
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os produtos da Fornada:", error);
        return { content: [], totalElements: 0, totalPages: 0 };
    }
}

export const productsThisFornadasService = async (idFornada, page = 0, size = 10) => {
    try {
        const response = await axiosApi.get(`/fornadas/da-vez/produtos/${idFornada}`, {
            params: {
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os produtos da Fornada:", error);
        return { content: [], totalElements: 0, totalPages: 0 };
    }
}