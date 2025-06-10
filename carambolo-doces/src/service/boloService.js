import { axiosApi } from '../provider/AxiosApi.js';

export const getBolosPorCategoria = async () => {
  try {
    const response = await axiosApi.get('/bolos/detalhe');
    return response.data; // array de bolos
  } catch (error) {
    console.error('Erro ao buscar bolos:', error);
    return [];
  }
};