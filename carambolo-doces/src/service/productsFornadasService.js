import { axiosApi } from '../provider/AxiosApi.js';

export const productsFornadasService = async () => {
    try {
        // Buscar todos os produtos sem paginação (size muito grande)
        const response = await axiosApi.get('/fornadas/produto-fornada', {
            params: {
                page: 0,
                size: 10000  // Número muito grande para pegar todos os produtos
            }
        });
        return response.data.content;
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