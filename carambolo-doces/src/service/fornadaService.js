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
    
    if (fornadas.length === 0) {
      return null;
    }
    
    // Ordena por data FIM decrescente para pegar a com dataFim mais recente
    const lastFornada = fornadas.sort((a, b) => 
      new Date(b.dataFim) - new Date(a.dataFim)  // Mudado de dataInicio para dataFim
    )[0];
    
    return lastFornada;
  } catch (error) {
    console.error('Erro ao buscar última fornada:', error);
    throw error;
  }
};

export const getFornadaAtiva = async () => {
  try {
    const fornadas = await listFornadas();
    
    if (fornadas.length === 0) return null;
    
    const hoje = new Date();
    
    // Primeiro, filtra fornadas que ainda não expiraram (dataFim >= hoje)
    const fornadasNaoExpiradas = fornadas.filter(fornada => {
      const dataFim = new Date(fornada.dataFim);
      dataFim.setHours(23, 59, 59, 999); // Fim do dia
      return dataFim >= hoje;
    });
    
    if (fornadasNaoExpiradas.length === 0) {
      // Se todas expiraram, pega a que expirou mais recentemente (maior dataFim)
      const lastFornada = fornadas.sort((a, b) => 
        new Date(b.dataFim) - new Date(a.dataFim)  // Ordena por dataFim decrescente
      )[0];
      
      return lastFornada;
    }
    
    // Das não expiradas, pega a que está ativa agora (hoje entre dataInicio e dataFim)
    const fornadasAtivas = fornadasNaoExpiradas.filter(fornada => {
      const dataInicio = new Date(fornada.dataInicio);
      const dataFim = new Date(fornada.dataFim);
      dataInicio.setHours(0, 0, 0, 0);   // Início do dia
      dataFim.setHours(23, 59, 59, 999); // Fim do dia
      
      const estaAtiva = hoje >= dataInicio && hoje <= dataFim;
      return estaAtiva;
    });
    
    if (fornadasAtivas.length > 0) {
      // Se há fornadas ativas, pega a com dataFim mais distante (que vai durar mais)
      const fornadaAtiva = fornadasAtivas.sort((a, b) => 
        new Date(b.dataFim) - new Date(a.dataFim)
      )[0];
      
      return fornadaAtiva;
    } else {
      // Se nenhuma está ativa, pega a próxima a começar (menor dataInicio no futuro)
      const proximaFornada = fornadasNaoExpiradas.sort((a, b) => 
        new Date(a.dataInicio) - new Date(b.dataInicio)
      )[0];
      
      return proximaFornada;
    }
  } catch (error) {
    console.error('Erro ao buscar fornada ativa:', error);
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

