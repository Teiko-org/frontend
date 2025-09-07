import { axiosApi } from '../provider/AxiosApi.js';

const reportService = async (options = {}) => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('JWT_TOKEN') : null;
        
        const config = {
            responseType: options.responseType || 'blob',
            ...options
        };

        // Adiciona token de autenticação se disponível
        if (token && token.trim() !== '') {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            };
        }

        const response = await axiosApi.get('/relatorios/insights', config);
        return response;
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        throw error;
    }
};

export default reportService;
