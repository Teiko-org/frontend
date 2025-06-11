import { axiosApi } from '../provider/AxiosApi.js';

export const getBolosPorCategoria = async () => {
  try {
    const token = localStorage.getItem('JWT_TOKEN');
    const config = {};
    
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }
    
    const response = await axiosApi.get('/bolos/detalhe', config);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar bolos:', error);
    return [];
  }
}; 