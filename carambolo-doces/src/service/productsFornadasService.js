import { axiosApi } from '../provider/AxiosApi.js';

const productsFornadasService = async () => {

    try {
        const response = await axiosApi.get('/fornadas/produto-fornada', {
            headers: {Authorization: (`Bearer ${localStorage.getItem('JWT_TOKEN')}`)}
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os produtos da Fornada:", error);
    }

}

export default productsFornadasService;