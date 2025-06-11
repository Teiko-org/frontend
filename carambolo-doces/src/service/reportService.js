import { axiosApi } from '../provider/AxiosApi.js';

const reportService = async (config = {}) => {
    try {
        const token = localStorage.getItem('JWT_TOKEN');
        let finalConfig = { ...config };
        
        // Primeiro tenta com autenticação se houver token
        if (token && token.trim() !== '') {
            try {
                const response = await axiosApi.get('/relatorios/insights', {
                    ...finalConfig,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        ...finalConfig.headers,
                    },
                });
                return response;
            } catch (authError) {
                console.warn("Erro com autenticação, tentando sem token:", authError);
            }
        }
        
        // Se não há token ou deu erro de auth, tenta sem autenticação
        const response = await axiosApi.get('/relatorios/insights', finalConfig);
        return response;
    } catch (error) {
        console.error("Erro ao buscar Relatório de Pedidos:", error);
        throw error;
    }
};

export default reportService;