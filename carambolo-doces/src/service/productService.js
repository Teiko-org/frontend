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
    try {
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
    } catch (error) {
        console.log(error);
        return [];
    }

};

export const findFeaturedDecoracoes = async () => {
    try {
        const response = await axiosApi.get(`/decoracoes/featured`);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const handleVisibilityBolo = (data, id) => {
    try {
        axiosApi.patch(`/bolos/atualizar-status/${id}`, {
            isAtivo: data[0].isAtivo
        });
    } catch (error) {
        console.log(error);
    }
}

export const handleVisibilityProdutoFornada = (data, id) => {
    try {
        axiosApi.patch(`/fornadas/produto-fornada/status/${id}`, {
            isAtivo: data[0].isAtivo
        });
    } catch (error) {
        console.log(error)
    }
}

export const handleDeleteBolo = (id) => {
    try {
        axiosApi.delete(`/bolos/${id}`);
    } catch (error) {
        console.log(error);
    }
}