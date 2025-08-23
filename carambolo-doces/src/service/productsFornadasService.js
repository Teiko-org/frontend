import { axiosApi } from '../provider/AxiosApi.js';

export const productsFornadasService = async () => {
    try {
        const token = localStorage.getItem('JWT_TOKEN');
        
        if (token && token.trim() !== '') {
            try {
                const response = await axiosApi.get('/fornadas/produto-fornada', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data;
            } catch (authError) {
                console.warn("Erro com autenticação, tentando sem token:", authError);
            }
        }
        
        const response = await axiosApi.get('/fornadas/produto-fornada');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os produtos da Fornada:", error);

        return [];
    }
}

export const productsThisFornadasService = async (idFornada) => {
    try {
        const token = localStorage.getItem('JWT_TOKEN');
        
        if (token && token.trim() !== '') {
            try {
                const response = await axiosApi.get(`/fornadas/da-vez/produtos/${idFornada}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data;
            } catch (authError) {
                console.warn("Erro com autenticação, tentando sem token:", authError);
            }
        }
        
        const response = await axiosApi.get(`/fornadas/da-vez/produtos/${idFornada}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os produtos da Fornada:", error);

        return [];
    }
}