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

export const atualizarFornadaDaVez = async (fornadaDaVezId, quantidade) => {
    try {
        const payload = { quantidade };
        const response = await axiosApi.put(`/fornadas/da-vez/${fornadaDaVezId}`, payload);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar Fornada da Vez:", error);
        throw error;
    }
}

export const excluirFornadaDaVez = async (fornadaDaVezId) => {
    try {
        await axiosApi.delete(`/fornadas/da-vez/${fornadaDaVezId}`);
        return true;
    } catch (error) {
        console.error("Erro ao excluir Fornada da Vez:", error);
        throw error;
    }
}

export default fornadaDaVezService;