import { axiosApi } from '../provider/AxiosApi.js';

const fornadaDaVezService = async ({fornadaId, produtoFornadaId, quantidade}) => {
    try {
        const token = localStorage.getItem('JWT_TOKEN');
        const payload = {
            fornadaId: fornadaId,
            produtoFornadaId: produtoFornadaId,
            quantidade: quantidade
        };
        
        // Primeiro tenta com autenticação se houver token
        if (token && token.trim() !== '') {
            try {
                const response = await axiosApi.post('/fornadas/da-vez', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.data;
            } catch (authError) {
                console.warn("Erro com autenticação, tentando sem token:", authError);
            }
        }
        
        // Se não há token ou deu erro de auth, tenta sem autenticação
        const response = await axiosApi.post('/fornadas/da-vez', payload);
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar Fornada da Vez:", error);
        throw error;
    }
}

export default fornadaDaVezService;