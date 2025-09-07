import { useNavigate } from 'react-router-dom';
import { axiosApi } from '../provider/AxiosApi.js';
import { toast } from 'react-toastify';

export const login = async (phone, password) => {
  try {
    const response = await axiosApi.post('/usuarios/login', { contato: phone, senha: password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleAuthError(error, phone);
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
        console.log("Carrinho do usuário migrado para convidado no logout");
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
    await axiosApi.post('/usuarios', {
      nome: name,
      senha: password,
      contato: phone
    });

    toast.success('Cadastro criado com sucesso!');
  } catch (error) {
    handleAuthError(error, phone);
    throw error;
  }
};

const handleAuthError = (error, phone) => {
  if (error.response && error.response.status === 409) {
    toast.error(`Usuário com contato ${phone} já existente`);
  } else if (error.response && error.response.status === 500) {
    toast.error('Tivemos problemas para processar seu cadastro. Tente novamente mais tarde!');
  } else if (error.response && error.response.status === 401) {
    toast.error('Telefone ou Senha incorretos.');
  } else if (error.response && error.response.status === 404) {
    toast.error(`Usuário com contato ${phone} não encontrado`);
  } else {
    toast.error('Erro de autenticação. Tente novamente.');
    console.error('Erro de autenticação', error);
  }
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

    console.log("Dados do usuário carregados:", userData);
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
  
  console.log("🧹 Dados de autenticação limpos com sucesso");
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
    console.warn("🔍 Dados de autenticação inválidos detectados. Limpando...");
    clearAuthData();
    return false;
  }
  
  return true;
};

export const uploadProfileImage = async (userId, file) => {
  try {
    console.log("Iniciando upload de imagem de perfil:", {
      userId,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: file.type
    });

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

    console.log("Upload realizado com sucesso:", response.data);
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