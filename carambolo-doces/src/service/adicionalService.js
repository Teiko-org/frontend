import { axiosApi } from '../provider/AxiosApi.js';

export const fetchAllAdicionais = async () => {
    const adicionais = await axiosApi.get("/adicionais")
    .then((res) => {
        return res.data
    })
    .catch((e) => console.log('erro ao buscar adicionais: ', e))

    return adicionais
}