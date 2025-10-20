import { axiosApi } from '../provider/AxiosApi.js';

export const getBolosPorCategoria = async () => {
  try {
    const response = await axiosApi.get('/bolos/detalhe');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar bolos:', error);
    return [];
  }
};

export const getBolosComImagens = async () => {
  try {
    const bolos = await getBolosPorCategoria();
    // Filtrar apenas bolos ativos (isAtivo/ativo true)
    const bolosAtivos = (bolos || []).filter((b) => {
      const flag = (b.isAtivo ?? b.ativo ?? b.ativoBolo ?? b.ativo);
      return flag === true;
    });

    // Para cada bolo, busca as imagens da decoração
    const bolosComImagens = await Promise.all(
      bolosAtivos.map(async (bolo) => {
        try {
          // Se tem decoração, busca as imagens
          if (bolo.decoracaoId) {
            const decoracaoResponse = await axiosApi.get(`/decoracoes/${bolo.decoracaoId}`);
            return {
              ...bolo,
              imagens: decoracaoResponse.data.imagens || []
            };
          }
          return {
            ...bolo,
            imagens: []
          };
        } catch (error) {
          console.warn(`Erro ao buscar imagens do bolo ${bolo.id}:`, error);
          return {
            ...bolo,
            imagens: []
          };
        }
      })
    );
    
    return bolosComImagens;
  } catch (error) {
    console.error('Erro ao buscar bolos com imagens:', error);
    throw error;
  }
}; 