import { axiosApi } from '../provider/AxiosApi';

export const listFornadas = async () => {
  try {
    const response = await axiosApi.get('/fornadas');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar fornadas:', error);
    throw error;
  }
};

export const getFornada = async (id) => {
  try {
    const response = await axiosApi.get(`/fornadas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fornada:', error);
    throw error;
  }
};

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

export const getProdutosPorFornadaId = async (fornadaId) => {
  try {
    const response = await axiosApi.get(`/fornadas/da-vez/produtos/${fornadaId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos por ID da fornada:', error);
    throw error;
  }
};

export const getFornadaAtual = async () => {
  try {
    const fornadas = await listFornadas();
    if (fornadas.length === 0) return null;
    
    const fornadaAtual = fornadas.sort((a, b) => 
      new Date(b.dataInicio) - new Date(a.dataInicio)
    )[0];
    
    return fornadaAtual;
  } catch (error) {
    console.error('Erro ao buscar fornada atual:', error);
    throw error;
  }
};

export const getLastFornada = async () => {
  try {
    const fornadas = await listFornadas();
    if (fornadas.length === 0) return null;
    const lastFornada = fornadas[fornadas.length - 1];
    return lastFornada;
  } catch (error) {
    console.error('Erro ao buscar última fornada:', error);
    throw error;
  }
};

export const createPedidoFornada = async (pedido) => {
  try {
    const response = await axiosApi.post('/fornadas/pedidos', pedido);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido de fornada:', error);
    throw error;
  }
}; 

export const insertNewFornada = async (data) => {
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
    throw error;
  }
};

export const fornadaService = insertNewFornada;

