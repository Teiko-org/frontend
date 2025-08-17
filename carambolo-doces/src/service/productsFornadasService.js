import { axiosApi } from '../provider/AxiosApi.js';

const productsFornadasService = async () => {
    try {
        const response = await axiosApi.get('/fornadas/produto-fornada');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os produtos da Fornada:", error);
        return [];
    }
}

export default productsFornadasService;