import { axiosApi } from '../provider/AxiosApi.js';

const reportService = async (config = {}) => {
    try {
        const response = await axiosApi.get('/relatorios/insights', {
            ...config,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('JWT_TOKEN')}`,
                ...config.headers,
            },
        });
        return response;
    } catch (error) {
        console.error("Erro ao buscar Relatório de Pedidos:", error);
    }
};

export default reportService;