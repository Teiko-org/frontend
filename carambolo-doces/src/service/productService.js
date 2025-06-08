import { axiosApi } from "../provider/AxiosApi"


export const findAllFornada = async () => {
    try {
        const fornadas = await axiosApi.get(`/fornadas`);

        const lastFornada = fornadas.data[fornadas.data.length - 1];

        const productsFornada = await axiosApi.get(`/fornadas/da-vez/produtos?data_inicio=${lastFornada.dataInicio}&data_fim=${lastFornada.dataFim}`);

        return productsFornada.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const findAllBolo = async () => {
    let bolosToResponse = []
    const bolos = await axiosApi.get(`/bolos/detalhe`)

    bolos.data.map(item => bolosToResponse.push({
        categoria: item.categoria,
        descricao: null,
        isAtivo: item.ativo,
        produto: item.produto,
        id: item.boloId,
        valor: item.precoTotal,
        quantidade: 0
    }));

    return bolosToResponse;
};