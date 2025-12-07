import { axiosApi } from '../provider/AxiosApi';

export async function buscarCarrinhoBackend(userId) {
  try {
    const response = await axiosApi.get('/carrinho', {
      headers: {
        'X-User-Id': userId
      },
      timeout: 5000 // Timeout de 5 segundos
    });
    return response.data?.itens || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('Timeout')) {
      console.warn('Timeout ao buscar carrinho do backend');
      return [];
    }
    console.warn('Erro ao buscar carrinho do backend:', error.response?.status || error.message);
    return [];
  }
}

export async function salvarCarrinhoBackend(userId, itens) {
  try {
    await axiosApi.put('/carrinho', 
      { itens },
      {
        headers: {
          'X-User-Id': userId
        },
        timeout: 5000 // Timeout de 5 segundos
      }
    );
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('Timeout')) {
      console.warn('Timeout ao salvar carrinho no backend');
      return;
    }
    console.warn('Erro ao salvar carrinho no backend:', error.response?.status || error.message);
  }
}

export async function limparCarrinhoBackend(userId) {
  try {
    if (!userId) {
      return;
    }
    await axiosApi.delete('/carrinho', {
      headers: {
        'X-User-Id': userId.toString()
      }
    });
  } catch (error) {
    console.warn('Erro ao limpar carrinho no backend:', error.response?.status || error.message);
  }
}