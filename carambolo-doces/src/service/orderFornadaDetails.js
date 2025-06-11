import { axiosApi } from '../provider/AxiosApi.js';

const orderFornadaDetails = async (id) => {
    try {
        const token = localStorage.getItem('JWT_TOKEN');
        
        // Primeiro tenta com autenticação se houver token
        if (token && token.trim() !== '') {
            try {
                const response = await axiosApi.get(`/resumo-pedido/pedido-fornada/detalhe/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.data;
            } catch (authError) {
                console.warn("Erro com autenticação, tentando sem token:", authError);
            }
        }
        
        // Se não há token ou deu erro de auth, tenta sem autenticação
        const response = await axiosApi.get(`/resumo-pedido/pedido-fornada/detalhe/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Detalhes do Pedido de Fornada:", error);
        throw error;
    }
};


export default orderFornadaDetails;