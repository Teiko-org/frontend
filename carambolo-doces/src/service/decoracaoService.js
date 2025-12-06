import { axiosApi } from "../provider/AxiosApi";

export async function getAllDecoracoes() {
  try {
    const { data } = await axiosApi.get("/decoracoes");
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar decorações:", error);
    return [];
  }
}

export async function getDecoracaoById(id) {
  try {
    const { data } = await axiosApi.get(`/decoracoes/${id}`);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar decoração ${id}:`, error);
    return null;
  }
}

export async function createDecoracao(decoracao) {
  try {
    const { data } = await axiosApi.post("/decoracoes", decoracao);
    return data;
  } catch (error) {
    console.error("Erro ao criar decoração:", error);
    throw error;
  }
}

export async function updateDecoracao(id, decoracaoData) {
  try {
    const { data } = await axiosApi.put(`/decoracoes/${id}`, decoracaoData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar decoração ${id}:`, error);
    throw error;
  }
}

export async function deleteDecoracao(id) {
  try {
    await axiosApi.delete(`/decoracoes/${id}`);
    return true;
  } catch (error) {
    console.error(`Erro ao deletar decoração ${id}:`, error);
    throw error;
  }
}

export async function getDecoraceosComAdicionais() {
  try {
    const { data } = await axiosApi.get("/decoracoes/adicionais");
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar decorações com adicionais:", error);
    return [];
  }
}
