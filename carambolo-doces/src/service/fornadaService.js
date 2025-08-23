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
    console.log('🔍 [DEBUG] Buscando produtos da fornada ID:', fornadaId);

    // Primeiro busca os produtos da fornada
    const produtosFornada = await getProdutosPorFornadaId(fornadaId);
    console.log('🔍 [DEBUG] Produtos da fornada encontrados:', produtosFornada.length);
    console.log('🔍 [DEBUG] Lista de produtos:', produtosFornada.map(p => ({ id: p.id, nome: p.produto })));

    // Para cada produto, busca também os dados completos com imagens da listagem geral
    const produtosComImagens = await Promise.all(
      produtosFornada.map(async (produto) => {
        try {
          console.log(`🔍 [DEBUG] Processando produto ${produto.id} - ${produto.produto}`);

          // Busca dados do produto na listagem geral que inclui imagens
          let response = await axiosApi.get('/fornadas/produto-fornada');

          console.log(`🔍 [DEBUG] Busca geral retornou ${response.data.length} produtos`);
          const produtoDetalhado = response.data.find(p => p.id === produto.id);
          console.log(`🔍 [DEBUG] Produto ${produto.id} encontrado na listagem geral:`, !!produtoDetalhado);

          if (produtoDetalhado) {
            console.log(`🔍 [DEBUG] Produto ${produto.id} tem ${produtoDetalhado.imagens?.length || 0} imagens`);
            if (produtoDetalhado.imagens && produtoDetalhado.imagens.length > 0) {
              console.log(`🔍 [DEBUG] Primeira imagem do produto ${produto.id}:`, produtoDetalhado.imagens[0]);
            }

            const resultado = {
              ...produto,
              imagens: produtoDetalhado.imagens || []
            };

            console.log(`🔍 [DEBUG] Resultado final para produto ${produto.id}:`, {
              id: resultado.id,
              nome: resultado.produto,
              imagensCount: resultado.imagens?.length || 0,
              primeiraImagem: resultado.imagens?.[0]
            });

            return resultado;
          }

          console.log(`🔍 [DEBUG] Produto ${produto.id} NÃO encontrado na listagem geral`);
          return {
            ...produto,
            imagens: []
          };
        } catch (error) {
          console.warn(`🔍 [DEBUG] Erro ao buscar imagens do produto ${produto.id}:`, error);
          return {
            ...produto,
            imagens: []
          };
        }
      })
    );

    console.log('🔍 [DEBUG] Resultado final de getProdutosFornadaComImagens:');
    produtosComImagens.forEach(p => {
      console.log(`  - ${p.produto} (ID ${p.id}): ${p.imagens?.length || 0} imagens`);
      if (p.imagens && p.imagens.length > 0) {
        console.log(`    Primeira imagem: ${p.imagens[0]}`);
      }
    });

    return produtosComImagens;
  } catch (error) {
    console.error('🔍 [DEBUG] Erro ao buscar produtos da fornada com imagens:', error);
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

export const fornadaService = insertNewFornada;

