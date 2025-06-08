import { axiosApi } from '../provider/AxiosApi.js';

const fornadaDaVezService = async ({fornadaId, produtoFornadaId, quantidade}) => {

    try {
        const response = await axiosApi.post('/fornadas/da-vez', {
            fornadaId: fornadaId,
            produtoFornadaId: produtoFornadaId,
            quantidade: quantidade
        }, {
            headers: { Authorization: (`Bearer ${localStorage.getItem('JWT_TOKEN')}`) }
        }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar Fornada da Vez:", error);
    }

}

export default fornadaDaVezService;