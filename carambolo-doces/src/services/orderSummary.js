import { axiosApi } from '../provider/AxiosApi.js';

const orderSummary = async () => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('JWT_TOKEN') : null;
        try {
            const response = await axiosApi.get('/resumo-pedido', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.content;
        } catch (authError) {
            console.warn('Erro com autenticação, tentando sem token:', authError);
            // Fallback: tenta sem autenticação
            const response = await axiosApi.get('/resumo-pedido');
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao buscar o Resumo dos Pedidos:', error);
        return [];
    }
};

export default orderSummary;