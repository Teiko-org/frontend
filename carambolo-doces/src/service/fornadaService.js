import { axiosApi } from '../provider/AxiosApi';

// Listar todas as fornadas
export const listFornadas = async () => {
  try {
    const response = await axiosApi.get('/fornadas');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar fornadas:', error);
    throw error;
  }
};

// Buscar fornada por ID
export const getFornada = async (id) => {
  try {
    const response = await axiosApi.get(`/fornadas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fornada:', error);
    throw error;
  }
};

// Buscar produtos da fornada da vez por período
export const getProdutosFornadaDaVez = async (dataInicio, dataFim) => {
  try {
    const response = await axiosApi.get('/fornadas/da-vez/produtos', {
      params: {
        data_inicio: dataInicio,
        data_fim: dataFim
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos da fornada da vez:', error);
    throw error;
  }
};

// Buscar produtos da fornada da vez por ID específico da fornada
export const getProdutosPorFornadaId = async (fornadaId) => {
  try {
    const response = await axiosApi.get(`/fornadas/da-vez/produtos/${fornadaId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos por ID da fornada:', error);
    throw error;
  }
};

// Buscar fornada ativa atual (último período)
export const getFornadaAtual = async () => {
  try {
    const fornadas = await listFornadas();
    if (fornadas.length === 0) return null;
    
    // Ordena por data de início descrescente para pegar a mais recente
    const fornadaAtual = fornadas.sort((a, b) => 
      new Date(b.dataInicio) - new Date(a.dataInicio)
    )[0];
    
    return fornadaAtual;
  } catch (error) {
    console.error('Erro ao buscar fornada atual:', error);
    throw error;
  }
};

// Criar pedido de fornada
export const createPedidoFornada = async (pedido) => {
  try {
    const response = await axiosApi.post('/fornadas/pedidos', pedido);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido de fornada:', error);
    throw error;
  }
}; 


export const fornadaService = async (data) => {

    console.log(data);
    try {
        const response = await axiosApi.post('/fornadas', {
            dataInicio: data.dataInicio,
            dataFim: data.dataFim
        },
            {
                headers: { Authorization: (`Bearer ${localStorage.getItem('JWT_TOKEN')}`) }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar Fornada:", error);
    }

}

