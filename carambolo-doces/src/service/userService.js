import { useNavigate } from 'react-router-dom';
import { axiosApi } from '../provider/AxiosApi.js';
import { toast } from 'react-toastify';

export const login = async (phone, password) => {
  try {
    // Limpa o telefone e adiciona o código do país 55 (Brasil)
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const phoneWithCountryCode = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    
    
    const response = await axiosApi.post('/usuarios/login', { contato: phoneWithCountryCode, senha: password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleAuthError(error, phoneWithCountryCode || phone);
    throw error;
  }
};

export const logOff = () => {
  try {
    // Migrar carrinho do usuário para convidado antes de fazer logout
    const userId = localStorage.getItem("userId");
    if (userId) {
      const userCartKey = `CART_ITEMS_USER_${userId}`;
      const userCart = localStorage.getItem(userCartKey);
      if (userCart) {
        localStorage.setItem("CART_ITEMS_GUEST", userCart);
      }
    }

    // Tentar fazer logout no servidor (pode falhar se o token já estiver inválido)
    axiosApi.post('usuarios/logOut', {}).catch(() => {
      console.log("Logout no servidor falhou (token já inválido)");
    });
    
    // Limpar todos os dados de autenticação
    clearAuthData();
    
    console.log("✅ Logout realizado com sucesso");
  } catch (e) {
    toast.error("Falha ao deslogar");
    console.log("Erro ao deslogar: " + e);
  }
};

export const register = async (name, password, phone) => {
  try {
    // Limpa o telefone e adiciona o código do país 55 (Brasil)
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const phoneWithCountryCode = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    
    const requestData = {
      nome: name,
      senha: password,
      contato: phoneWithCountryCode
    };
    
    const response = await axiosApi.post('/usuarios', requestData);
    
    toast.success('Cadastro criado com sucesso!');
    return response.data;
  } catch (error) {
    // Usar phoneWithCountryCode que foi definido no escopo da função
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const phoneWithCountryCode = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    handleAuthError(error, phoneWithCountryCode);
    throw error;
  }
};

// Função para verificar se um telefone já está cadastrado
// Nota: Esta função foi removida pois estava causando problemas com o endpoint de login
// A validação de telefone duplicado agora é feita apenas no momento do cadastro
// através do tratamento do erro 409 retornado pelo backend

const handleAuthError = (error, phone) => {
  console.log('=== DEBUG handleAuthError ===');
  console.log('Error:', error);
  console.log('Error response:', error.response);
  console.log('Error status:', error.response?.status);
  console.log('Phone:', phone);
  
  if (error.response && error.response.status === 409) {
    // Formatar o telefone para exibição mais amigável
    const formattedPhone = phone ? formatPhoneForDisplay(phone) : 'este telefone';
    console.log('Formatted phone:', formattedPhone);
    console.log('Exibindo toast de erro 409...');
    
    toast.error(
      `Este telefone (${formattedPhone}) já está cadastrado. Tente fazer login ou use outro número.`,
      {
        autoClose: 6000,
        closeOnClick: true,
        pauseOnHover: true,
      }
    );
  } else if (error.response && error.response.status === 500) {
    console.log('Exibindo toast de erro 500...');
    toast.error('Tivemos problemas para processar seu cadastro. Tente novamente mais tarde!');
  } else if (error.response && error.response.status === 401) {
    console.log('Exibindo toast de erro 401...');
    toast.error('Telefone ou Senha incorretos.');
  } else if (error.response && error.response.status === 404) {
    console.log('Exibindo toast de erro 404...');
    toast.error(`Usuário com contato ${phone} não encontrado`);
  } else {
    console.log('Exibindo toast de erro genérico...');
    toast.error('Erro de autenticação. Tente novamente.');
    console.error('Erro de autenticação', error);
  }
};

// Função auxiliar para formatar telefone para exibição
const formatPhoneForDisplay = (phone) => {
  if (!phone) return '';
  
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Se tem código do país 55 (Brasil), formata como (XX) XXXXX-XXXX
  if (cleanPhone.startsWith('55') && cleanPhone.length >= 12) {
    const ddd = cleanPhone.substring(2, 4);
    const firstPart = cleanPhone.substring(4, 9);
    const secondPart = cleanPhone.substring(9, 13);
    return `(${ddd}) ${firstPart}-${secondPart}`;
  }
  
  // Para outros formatos, retorna como está
  return phone;
};

export const changePassword = async (userId, senhaAtual, novaSenha) => {
  try {
    await axiosApi.patch(`/usuarios/${userId}/alterar-senha`, {
      senhaAtual,
      novaSenha
    });

    toast.success("Senha alterada com sucesso! Faça login novamente.");
    clearAuthData();
    return true;
  } catch (error) {
    toast.error("Erro ao alterar senha: " + (error.response?.data?.message || "Tente novamente"));
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await axiosApi.delete(`/usuarios/${userId}`);

    toast.success("Conta excluída com sucesso!");
    clearAuthData();
    return true;
  } catch (error) {
    toast.error("Erro ao excluir conta. Tente novamente.");
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    // Verificar se o userId é válido
    if (!userId || userId === 'null' || userId === 'undefined') {
      throw new Error('ID do usuário inválido');
    }

    const response = await axiosApi.get(`/usuarios/${userId}`);
    const userData = {
      nome: response.data.nome,
      contato: response.data.contato,
      dataNascimento: response.data.dataNascimento,
      genero: response.data.genero,
      imagemUrl: response.data.imagemUrl,
    };

    return userData;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw error;
  }
};

export const updateUserData = async (userId, userData, shouldLogout = true) => {
  try {
    const response = await axiosApi.patch(`/usuarios/${userId}/dados-pessoais`, userData);

    if (shouldLogout) {
      toast.success("Telefone alterado com sucesso! Faça login novamente.");
      clearAuthData();
    } else {
      toast.success("Dados atualizados com sucesso!");
    }

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      toast.error('Este telefone já está em uso por outro usuário');
    } else if (error.response && error.response.status === 404) {
      toast.error('Usuário não encontrado');
    } else {
      toast.error('Erro ao atualizar dados. Tente novamente.');
    }
    console.error("Erro ao atualizar dados do usuário:", error);
    throw error;
  }
};

export const setAuthData = (userId, token) => {
  localStorage.setItem("userId", userId);
  localStorage.setItem("IS_SIGNED", true);
  window.dispatchEvent(new Event("storage"));
};

export const clearAuthData = () => {
  // Limpar dados do localStorage
  localStorage.removeItem("userId");
  localStorage.removeItem("IS_SIGNED");
  localStorage.removeItem("userData");
  
  // Limpar cookies de autenticação
  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // Disparar evento para notificar outros componentes
  window.dispatchEvent(new Event("storage"));
  
};

// Função para verificar e limpar dados de autenticação inválidos
export const validateAndCleanAuth = () => {
  const isSigned = localStorage.getItem("IS_SIGNED");
  const userId = localStorage.getItem("userId");
  
  // Se não há dados de autenticação, não fazer nada
  if (!isSigned || !userId) {
    return false;
  }
  
  // Se os dados parecem inválidos, limpar
  if (userId === 'null' || userId === 'undefined' || userId === '') {
    clearAuthData();
    return false;
  }
  
  return true;
};

export const uploadProfileImage = async (userId, file) => {
  try {

    // Validações no frontend
    if (!file.type.startsWith('image/')) {
      throw new Error('Arquivo deve ser uma imagem');
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB
      throw new Error('Arquivo muito grande (máximo 20MB)');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosApi.post(`/usuarios/${userId}/upload-imagem`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    toast.success("Imagem de perfil atualizada com sucesso!");

    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new CustomEvent("userImageUpdated", {
      detail: { imagemUrl: response.data.imagemUrl }
    }));

    return response.data;

  } catch (error) {
    console.error("Erro no upload:", error);

    if (error.message.includes('imagem') || error.message.includes('grande')) {
      toast.error(error.message);
    } else if (error.response?.status === 401) {
      toast.error("Sessão expirada. Faça login novamente.");
    } else if (error.response?.status === 404) {
      toast.error("Usuário não encontrado.");
    } else if (error.response?.status === 400) {
      toast.error("Arquivo inválido. Selecione uma imagem válida.");
    } else {
      toast.error("Erro ao fazer upload da imagem. Tente novamente.");
    }

    throw error;
  }
};