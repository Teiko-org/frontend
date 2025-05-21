import { axiosApi } from '../provider/AxiosApi.js';
import { toast } from 'react-toastify';

export const login = async (phone, password) => {
  try {
    const response = await axiosApi.post('/usuarios/login', {
      contato: phone,
      senha: password
    });

    toast.success('Login realizado com sucesso!');
    localStorage.setItem('TOKEN_JWT', response.data.token);
    localStorage.setItem('IS_SIGNED', true);
  } catch (error) {
    handleAuthError(error, phone);
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
  }
};

const handleAuthError = (error, phone) => {
  if (error.response && error.response.status === 409) {
    alert(`Usuário com contato ${phone} já existente`);
  } else if (error.response && error.response.status === 500) {
    alert('Tivemos problemas para processar seu cadastro. Tente novamente mais tarde!');
  } else if (error.response && error.response.status === 401) {
    toast.error('Telefone ou Senha incorretos.');
  } else if (error.response && error.response.status === 404) {
    toast.error(`Usuário com contato ${phone} não encontrado`);
  } else {
    console.error('Erro de autenticação', error);
  }
};