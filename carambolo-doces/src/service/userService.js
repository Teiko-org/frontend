import { useNavigate } from 'react-router-dom';
import { axiosApi } from '../provider/AxiosApi.js';
import { toast } from '../utils/toast';

export const login = async (phone, password) => {
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const phoneWithCountryCode = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const contatoToSend = (cleanPhone.length >= 12 && cleanPhone.startsWith('55'))
    ? cleanPhone.slice(-11)
    : cleanPhone;

  try {
    const response = await axiosApi.post('/usuarios/login', { contato: contatoToSend, senha: password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleAuthError(error, contatoToSend);
    throw error;
  }
};

export const logOff = () => {
  try {
    axiosApi.post('usuarios/logOut', {}).catch(() => {});
    
    clearAuthData();
  } catch (e) {
    toast.error('Falha ao deslogar');
    console.log("Erro ao deslogar: " + e);
  }
};

export const register = async (name, password, phone) => {
  try {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const phoneWithCountryCode = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const contatoToSend = (cleanPhone.length >= 12 && cleanPhone.startsWith('55'))
      ? cleanPhone.slice(-11)
      : cleanPhone;
    
    const requestData = {
      nome: name,
      senha: password,
      contato: contatoToSend
    };
    
    const response = await axiosApi.post('/usuarios', requestData);
    
    toast.success('Cadastro criado com sucesso!');
    return response.data;
  } catch (error) {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const contatoToSend = (cleanPhone.length >= 12 && cleanPhone.startsWith('55'))
      ? cleanPhone.slice(-11)
      : cleanPhone;
    handleAuthError(error, contatoToSend);
    throw error;
  }
};


const handleAuthError = (error, phone) => {
  if (error.response && error.response.status === 409) {
    toast.error('Este telefone já está cadastrado. Tente fazer login ou use outro número.');
  } else if (error.response && error.response.status === 500) {
    toast.error('Tivemos problemas para processar seu cadastro. Tente novamente mais tarde!');
  } else if (error.response && error.response.status === 401) {
    toast.error('Telefone ou Senha incorretos.');
  } else if (error.response && error.response.status === 404) {
    console.error(`[ERROR] Usuário com contato ${phone} não encontrado`);
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

    toast.success('Senha alterada com sucesso! Faça login novamente.');
    clearAuthData();
    return true;
  } catch (error) {
    let errorMessage = "Erro ao alterar senha. Tente novamente.";
    
    if (error.response?.status === 400) {
      const data = error.response.data;
      
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const firstError = data.errors[0];
        const field = firstError.field || firstError.property || '';
        const message = firstError.defaultMessage || firstError.message || '';
        
        if (field === 'novaSenha' || message.includes('senha') || message.includes('A senha deve ter')) {
          errorMessage = message || "A senha deve ter no mínimo 6 caracteres, incluir pelo menos uma letra maiúscula, um número e um caractere especial (!@#$%^&*).";
        } else if (field === 'senhaAtual') {
          errorMessage = "Senha atual incorreta.";
        } else {
          errorMessage = message || errorMessage;
        }
      } else if (data.message) {
        if (data.message.includes("novaSenha") || data.message.includes("Pattern") || data.message.includes("regexp") || data.message.includes("A senha deve ter")) {
          errorMessage = "A senha deve ter no mínimo 6 caracteres, incluir pelo menos uma letra maiúscula, um número e um caractere especial (!@#$%^&*).";
        } else if (data.message.includes("igual") || data.message.includes("mesma")) {
          errorMessage = "A nova senha não pode ser igual à senha atual.";
        } else {
          errorMessage = data.message;
        }
      } else if (typeof data === 'string' && data.includes("Validation failed")) {
        errorMessage = "A senha não atende aos requisitos de segurança. Verifique se contém: mínimo 6 caracteres, uma maiúscula, um número e um caractere especial.";
      } else {
        errorMessage = "A senha não atende aos requisitos de segurança. Verifique se contém: mínimo 6 caracteres, uma maiúscula, um número e um caractere especial (!@#$%^&*).";
      }
    } else if (error.response?.status === 401) {
      errorMessage = "Senha atual incorreta.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    toast.error(errorMessage);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await axiosApi.delete(`/usuarios/${userId}`);

    toast.success('Conta excluída com sucesso!');
    clearAuthData();
    return true;
  } catch (error) {
    toast.error('Erro ao excluir conta. Tente novamente.');
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
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
      toast.success('Telefone alterado com sucesso! Faça login novamente.');
      clearAuthData();
    } else {
      toast.success('Dados atualizados com sucesso!');
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
  localStorage.removeItem("userId");
  localStorage.removeItem("IS_SIGNED");
  localStorage.removeItem("userData");
  
  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  window.dispatchEvent(new Event("storage"));
};

export const validateAndCleanAuth = () => {
  const isSigned = localStorage.getItem("IS_SIGNED");
  const userId = localStorage.getItem("userId");
  
  if (!isSigned || !userId) {
    return false;
  }
  
  if (userId === 'null' || userId === 'undefined' || userId === '') {
    clearAuthData();
    return false;
  }
  
  return true;
};

export const uploadProfileImage = async (userId, file) => {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Arquivo deve ser uma imagem');
    }

    if (file.size > 20 * 1024 * 1024) {
      throw new Error('Arquivo muito grande (máximo 20MB)');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosApi.post(`/usuarios/${userId}/upload-imagem`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    toast.success('Imagem de perfil atualizada com sucesso!');

    window.dispatchEvent(new CustomEvent("userImageUpdated", {
      detail: { imagemUrl: response.data.imagemUrl }
    }));

    return response.data;

  } catch (error) {
    console.error("Erro no upload:", error);

    if (error.message.includes('imagem') || error.message.includes('grande')) {
      toast.error(error.message);
    } else if (error.response?.status === 401) {
      toast.error('Sessão expirada. Faça login novamente.');
    } else if (error.response?.status === 404) {
      toast.error('Usuário não encontrado.');
    } else if (error.response?.status === 400) {
      toast.error('Arquivo inválido. Selecione uma imagem válida.');
    } else {
      toast.error('Erro ao fazer upload da imagem. Tente novamente.');
    }

    throw error;
  }
};