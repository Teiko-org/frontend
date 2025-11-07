import { axiosApi } from '../provider/AxiosApi';

function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = String(dateStr).split("-").map(Number);
  if (!y || !m || !d) return new Date(dateStr);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

export const listFornadas = async () => {
  try {
    const response = await axiosApi.get('/fornadas/todas');
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

    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const encerradas = fornadas.filter(f => {
      const fim = parseLocalDate(f.dataFim);
      const ini = parseLocalDate(f.dataInicio);
      if (!fim || !ini) return false;
      fim.setHours(0,0,0,0);
      ini.setHours(0,0,0,0);
      return ini <= hoje && fim <= hoje;
    });

    if (encerradas.length === 0) return null;

    const lastFornada = encerradas.sort((a, b) => new Date(b.dataFim) - new Date(a.dataFim))[0];
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

    const hoje = new Date(); hoje.setHours(0,0,0,0);

    const fornadasNaoExpiradas = (fornadas || [])
      .filter(f => (f.isAtivo ?? f.ativo) === true)
      .filter(fornada => {
        const dataFim = parseLocalDate(fornada.dataFim);
        dataFim.setHours(0,0,0,0);
        return dataFim > hoje;
      });

    if (fornadasNaoExpiradas.length === 0) {
      return null;
    }

    const fornadasAtivas = fornadasNaoExpiradas.filter(fornada => {
      const [yi, mi, di] = String(fornada.dataInicio).split("-").map(Number);
      const [yf, mf, df] = String(fornada.dataFim).split("-").map(Number);
      const dataInicio = new Date(yi, mi - 1, di, 0, 0, 0, 0);
      const dataFim = new Date(yf, mf - 1, df, 0, 0, 0, 0);
      return hoje >= dataInicio && hoje < dataFim;

    });

    if (fornadasAtivas.length > 0) {
      const fornadaAtiva = fornadasAtivas.sort((a, b) =>
        new Date(b.dataFim) - new Date(a.dataFim)
      )[0];

      return fornadaAtiva;
    } else {
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

export const getFornadaRealmenteAtiva = async () => {
  try {
    const fornadas = await listFornadas();

    if (fornadas.length === 0) return null;

    const hoje = new Date();

    const fornadasAtivas = (fornadas || [])
      .filter(f => (f.isAtivo ?? f.ativo) === true)
      .filter(fornada => {
        const [yi, mi, di] = String(fornada.dataInicio).split("-").map(Number);
        const [yf, mf, df] = String(fornada.dataFim).split("-").map(Number);
        const dataInicio = new Date(yi, mi - 1, di, 0, 0, 0, 0);
        const dataFim = new Date(yf, mf - 1, df, 23, 59, 59, 999);
        return hoje >= dataInicio && hoje <= dataFim;
      });

    if (fornadasAtivas.length > 0) {
      const fornadaAtiva = fornadasAtivas.sort((a, b) =>
        new Date(b.dataFim) - new Date(a.dataFim)
      )[0];

      return fornadaAtiva;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar fornada realmente ativa:', error);
    throw error;
  }
};

export const getProximaFornada = async () => {
  try {
    const response = await axiosApi.get('/fornadas/proxima');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar próxima fornada:', error);
    return null;
  }
};

export const getProdutoFornadaById = async (fornadaDaVezId) => {
  try {
    const response = await axiosApi.get(`/fornadas/da-vez/${fornadaDaVezId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produto da fornada:', error);
    throw error;
  }
};

export const getProdutosFornadaComImagens = async (fornadaId) => {
  try {
    const produtosFornada = await getProdutosPorFornadaId(fornadaId);

    const produtosComImagens = await Promise.all(
      produtosFornada.map(async (produto) => {
        try {
          let response = await axiosApi.get('/fornadas/produto-fornada');
          const produtosLista = Array.isArray(response.data) ? response.data : [];
          const produtoDetalhado = produtosLista.find(p => p.id === produto.id);

          if (produtoDetalhado) {
            return {
              ...produto,
              imagens: produtoDetalhado.imagens || []
            };
          }

          return {
            ...produto,
            imagens: []
          };
        } catch (error) {
          console.warn(`Erro ao buscar imagens do produto ${produto.id}:`, error);
          return {
            ...produto,
            imagens: []
          };
        }
      })
    );

    return produtosComImagens;
  } catch (error) {
    console.error('Erro ao buscar produtos da fornada com imagens:', error);
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
  try {
    const payload = {
      dataInicio: data.dataInicio,
      dataFim: data.dataFim
    };
    const response = await axiosApi.post('/fornadas', payload);
    return response.data;

  } catch (error) {
    console.error("Erro ao cadastrar Fornada:", error);
    throw error;
  }
};

export const getMesesAnosFornadas = async () => {
  try {
    const response = await axiosApi.get('/fornadas/meses-anos');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar fornadas:', error);
    throw error;
  }
};

export const getFornadasMesAno = async (mes, ano) => {
  try {
    const todas = await listFornadas();
    return (todas || []).filter(f => {
      const [y, m] = String(f.dataInicio || '').split('-').map(Number);
      return y === Number(ano) && m === Number(mes);
    }).map(f => ({ id: f.id, dataInicio: f.dataInicio, dataFim: f.dataFim }));
  } catch (error) {
    console.error('Erro ao buscar fornadas por mês/ano:', error);
    throw error;
  }
};

export const fornadaService = insertNewFornada;

export const updateFornada = async (id, fornadaData) => {
  try {
    const payload = {
      dataInicio: fornadaData.dataInicio,
      dataFim: fornadaData.dataFim
    };
    
    const response = await axiosApi.put(`/fornadas/${id}`, payload);
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao atualizar fornada:', error);
    throw error;
  }
};

export const encerrarFornada = async (fornadaId) => {
  try {
    const response = await axiosApi.delete(`/fornadas/${fornadaId}`);
    return response.status === 204;
  } catch (error) {
    console.error('Erro ao encerrar fornada:', error);
    throw error;
  }
};
