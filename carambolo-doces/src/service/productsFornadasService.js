import { axiosApi } from '../provider/AxiosApi.js';

const productsFornadasService = async () => {
    try {
        const token = localStorage.getItem('JWT_TOKEN');
        
        // Primeiro tenta com autenticação se houver token
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
        
        // Se não há token ou deu erro de auth, tenta sem autenticação
        const response = await axiosApi.get('/fornadas/produto-fornada');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os produtos da Fornada:", error);
        // Retorna array vazio em caso de erro para evitar quebrar o frontend
        return [];
    }
}

export default productsFornadasService;