import { axiosApi } from '../provider/AxiosApi.js';

const reportService = async (config = {}) => {
    try {
        let finalConfig = { ...config };

        const response = await axiosApi.get('/relatorios/insights', {
            ...finalConfig
        });
        return response;

    } catch (error) {
        console.error("Erro ao buscar Relatório de Pedidos:", error);
        throw error;
    }
};

export default reportService;