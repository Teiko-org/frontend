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

    // Coletar todos os IDs de decoração únicos
    const decoracaoIds = [...new Set(
      bolosAtivos
        .map(b => b.decoracaoId)
        .filter(Boolean)
    )];
    
    // Buscar todas as decorações de uma vez em paralelo
    const decoracoesMap = new Map();
    if (decoracaoIds.length > 0) {
      const decoracoesPromises = decoracaoIds.map(id => 
        axiosApi.get(`/decoracoes/${id}`)
          .then(r => [id, r.data])
          .catch(() => [id, null])
      );
      const decoracoesResults = await Promise.all(decoracoesPromises);
      decoracoesResults.forEach(([id, data]) => {
        if (data) decoracoesMap.set(id, data);
      });
    }
    
    // Mapear os bolos usando o mapa de decorações (sem requisições individuais)
    const bolosComImagens = bolosAtivos.map((bolo) => {
      try {
        if (bolo.decoracaoId && decoracoesMap.has(bolo.decoracaoId)) {
          const decoracao = decoracoesMap.get(bolo.decoracaoId);
          return {
            ...bolo,
            imagens: decoracao.imagens || []
          };
        }
        return {
          ...bolo,
          imagens: []
        };
      } catch (error) {
        console.warn(`Erro ao processar bolo ${bolo.id}:`, error);
        return {
          ...bolo,
          imagens: []
        };
      }
    });
    
    return bolosComImagens;
  } catch (error) {
    console.error('Erro ao buscar bolos com imagens:', error);
    throw error;
  }
}; 