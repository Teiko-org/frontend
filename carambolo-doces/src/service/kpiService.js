import { axiosApi } from '../provider/AxiosApi.js';

// Buscar KPI da fornada mais recente
export const getKPIFornadaMaisRecente = async () => {
    try {
        const response = await axiosApi.get('/dashboard/kpi-fornada-mais-recente');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar KPI da fornada mais recente:", error);
        return null;
    }
};

// Buscar KPI de uma fornada específica
export const getKPIFornada = async (fornadaId) => {
    try {
        const response = await axiosApi.get(`/dashboard/kpi-fornada/${fornadaId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar KPI da fornada:", error);
        return null;
    }
};

// Buscar KPI das fornadas do mês atual
export const getKPIFornadasPorPeriodo = async (ano, mes) => {
    try {
        const response = await axiosApi.get(`/dashboard/kpi-fornadas-por-periodo?ano=${ano}&mes=${mes}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar KPI das fornadas do período:", error);
        return null;
    }
};

// Buscar KPI das fornadas do mês atual
export const getKPIFornadasMesAtual = async () => {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth() + 1; // getMonth() retorna 0-11, então adicionamos 1
    
    return await getKPIFornadasPorPeriodo(ano, mes);
};
