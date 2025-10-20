import { axiosApi } from '../provider/AxiosApi.js';

const fornadaDaVezService = async ({ fornadaId, produtoFornadaId, quantidade }) => {
    try {
        const payload = {
            fornadaId: fornadaId,
            produtoFornadaId: produtoFornadaId,
            quantidade: quantidade
        };
        const response = await axiosApi.post('/fornadas/da-vez', payload);
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar Fornada da Vez:", error);
        throw error;
    }
}

export default fornadaDaVezService;