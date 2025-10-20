import { axiosApi } from "../provider/AxiosApi"


export const findAllFornada = async () => {
    try {
        const fornadas = await axiosApi.get(`/fornadas`);

        const lastFornada = fornadas.data[fornadas.data.length - 1];

        const productsFornada = await axiosApi.get(`/fornadas/da-vez/produtos?data_inicio=${lastFornada.dataInicio}&data_fim=${lastFornada.dataFim}`);
        // Normalizar para lista do ProductList e marcar tipo
        return (productsFornada.data || []).map((p) => ({
            tipo: 'FORNADA',
            categoria: p.categoria,
            descricao: p.descricao,
            isAtivo: p.isAtivo,
            produto: p.produto,
            id: p.id,
            valor: p.valor,
            quantidade: p.quantidade ?? 0
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const findAllBolo = async () => {
    try {
        let bolosToResponse = []
        const bolos = await axiosApi.get(`/bolos/detalhe`)

        bolos.data.map(item => bolosToResponse.push({
            tipo: 'BOLO',
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

export const handleVisibilityBolo = async (id, isAtivo) => {
    try {
        await axiosApi.patch(`/bolos/atualizar-status/${id}`, { isAtivo });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const handleVisibilityProdutoFornada = async (id, isAtivo) => {
    try {
        await axiosApi.patch(`/fornadas/produto-fornada/status/${id}`, { isAtivo });
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const handleDeleteBolo = (id) => {
    try {
        axiosApi.delete(`/bolos/${id}`);
    } catch (error) {
        console.log(error);
    }
}