import React, { createContext, useState } from 'react';
import { useForm, FormProvider as RHFProvider } from 'react-hook-form';
import { axiosApi } from '../provider/AxiosApi';

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const methods = useForm({ defaultValues: {} });
  const [currentStep, setCurrentStep] = useState(1);

  const [dadosEntrega, setDadosEntrega] = useState({});
  const [imagens, setImagens] = useState([]);
  const [dadosMontagem, setDadosMontagem] = useState({});

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const appendFormData = (data, category) => {
    switch (category) {
      case 'dadosEntrega':
        setDadosEntrega((prev) => ({ ...prev, ...data }));
        break;
      case 'imagens':
        setImagens((prev) => [...prev, ...(Array.isArray(data) ? data : [data])]);
        break;
      case 'dadosMontagem':
        setDadosMontagem((prev) => ({ ...prev, ...data }));
        break;
      default:
        break;
    }
  };

  const submitForm = async () => {
  try {
    console.log('Iniciando envio do pedido...');

    // POST para dados de entrega
    const responseEntrega = await axiosApi.post('/', dadosEntrega);
    console.log('Resposta de Entrega:', responseEntrega.data);

    // POST para imagens
    const formData = new FormData();
    imagens.forEach((file, index) => formData.append(`imagem_${index}`, file));
    
    const responseImagens = await axiosApi.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Resposta de Imagens:', responseImagens.data);

    // POST para dados de montagem
    const responseMontagem = await axiosApi.post('/', dadosMontagem);
    console.log('Resposta de Montagem:', responseMontagem.data);
    
  } catch (error) {
    console.error('Erro ao enviar:', error);
  }
};

  const formDataEntries = {
    ...dadosEntrega,
    ...dadosMontagem,
    adicionais: imagens,
  };

  return (
    <RHFProvider {...methods}>
      <FormContext.Provider value={{ currentStep, nextStep, prevStep, appendFormData, submitForm, formData: formDataEntries }}>
        {children}
      </FormContext.Provider>
    </RHFProvider>
  );
};