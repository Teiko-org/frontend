import { axiosApi } from '../provider/AxiosApi.js';

const orderSummary = async (page = 0, size = 20) => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('JWT_TOKEN') : null;
        try {
            const response = await axiosApi.get('/resumo-pedido', {
                params: {
                    page,
                    size
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (authError) {
            console.warn('Erro com autenticação, tentando sem token:', authError);
            // Fallback: tenta sem autenticação
            const response = await axiosApi.get('/resumo-pedido', {
                params: {
                    page,
                    size
                }
            });
            return response.data;
        }
    } catch (error) {
        console.error('Erro ao buscar o Resumo dos Pedidos:', error);
        return { content: [], totalPages: 0, totalElements: 0 };
    }
};

export default orderSummary;