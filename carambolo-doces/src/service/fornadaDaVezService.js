import { axiosApi } from '../provider/AxiosApi.js';

const fornadaDaVezService = async (data) => {

    try {
        const response = await axiosApi.post('/fornadas/da-vez', {
            headers: {Authorization: (`Bearer ${localStorage.getItem('JWT_TOKEN')}`)},
            produtoFornadaId: data.produtoFornadaId,
            fornadaId: data.fornadaId,
            quantidade: data.quantidade
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar Fornada da Vez:", error);
    }

}

export default fornadaDaVezService;