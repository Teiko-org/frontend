import { axiosApi } from '../provider/AxiosApi.js';
import { toast } from 'react-toastify';

export const createAddress = async (addressData) => {
  try {
    const response = await axiosApi.post('/enderecos', addressData);
    
    toast.success('Endereço cadastrado com sucesso!');
    return response.data;
  } catch (error) {
    handleAddressError(error, 'Erro ao cadastrar endereço');
    throw error;
  }
};

export const listAddresses = async () => {
  try {
    const response = await axiosApi.get('/enderecos');
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 204) {
      return [];
    }
    handleAddressError(error, 'Erro ao carregar endereços');
    throw error;
  }
};

export const listUserAddresses = async (userId) => {
  try {
    const response = await axiosApi.get(`/enderecos/usuario/${userId}`);
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 204) {
      return [];
    }
    handleAddressError(error, 'Erro ao carregar endereços do usuário');
    throw error;
  }
};

export const getAddressById = async (addressId) => {
  try {
    const response = await axiosApi.get(`/enderecos/${addressId}`);
    return response.data;
  } catch (error) {
    handleAddressError(error, 'Erro ao buscar endereço');
    throw error;
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    console.log(`Updating address ${addressId} with data:`, addressData);
    const response = await axiosApi.put(`/enderecos/${addressId}`, addressData);
    console.log('Update response:', response.data);
    
    toast.success('Endereço atualizado com sucesso!');
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    handleAddressError(error, 'Erro ao atualizar endereço');
    throw error;
  }
};

export const deleteAddress = async (addressId) => {
  try {
    await axiosApi.delete(`/enderecos/${addressId}`);
    
    toast.success('Endereço excluído com sucesso!');
    return true;
  } catch (error) {
    handleAddressError(error, 'Erro ao excluir endereço');
    throw error;
  }
};

const handleAddressError = (error, defaultMessage) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data;
    
    console.error('Erro detalhado do backend:', {
      status,
      data: error.response.data,
      config: error.config
    });
    
    switch (status) {
      case 404:
        toast.error('Endereço não encontrado');
        break;
      case 400:
        toast.error(`Dados inválidos: ${JSON.stringify(message) || 'Verifique os campos preenchidos'}`);
        break;
      case 409:
        toast.error('Endereço já cadastrado');
        break;
      case 500:
        toast.error('Erro interno do servidor. Tente novamente mais tarde.');
        break;
      default:
        toast.error(defaultMessage);
    }
  } else {
    toast.error(defaultMessage);
  }
  
  console.error('Erro no serviço de endereços:', error);
}; 