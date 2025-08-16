import { useNavigate } from 'react-router-dom';
import { axiosApi } from '../provider/AxiosApi.js';
import { toast } from 'react-toastify';

export const login = async (phone, password) => {
  try {
    const response = await axiosApi.post('/usuarios/login', { contato: phone, senha: password }, { withCredentials: true });
    if (response.data.admin != null) {
      localStorage.setItem("IS_ADMIN", true);
    }
    return response.data;
  } catch (error) {
    handleAuthError(error, phone);
    throw error;
  }
};

export const logOff = () => {
  try {
    axiosApi.post('usuarios/logOut', {})
    localStorage.removeItem("IS_SIGNED");
    localStorage.removeItem("userId");
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("userData");

    window.dispatchEvent(new Event("storage"));
  } catch(e) {
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

export const changePassword = async (userId, senhaAtual, novaSenha, token) => {
  try {
    await axiosApi.patch(`/usuarios/${userId}/alterar-senha`, {
      senhaAtual,
      novaSenha
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    toast.success("Senha alterada com sucesso! Faça login novamente.");
    clearAuthData();
    return true;
  } catch (error) {
    toast.error("Erro ao alterar senha: " + (error.response?.data?.message || "Tente novamente"));
    throw error;
  }
};

export const deleteUser = async (userId, token) => {
  try {
    await axiosApi.delete(`/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

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

export const updateUserData = async (userId, userData, token, shouldLogout = true) => {
  try {
    const response = await axiosApi.patch(`/usuarios/${userId}/dados-pessoais`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

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
  localStorage.setItem("JWT_TOKEN", token);
  localStorage.setItem("IS_SIGNED", true);
  window.dispatchEvent(new Event("storage"));
};

export const clearAuthData = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("JWT_TOKEN");
  localStorage.removeItem("IS_SIGNED");
  window.dispatchEvent(new Event("storage"));
};

export const uploadProfileImage = async (userId, file, token) => {
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
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
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