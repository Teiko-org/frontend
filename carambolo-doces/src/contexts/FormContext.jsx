import React, { createContext, useState } from 'react';
import { useForm, FormProvider as RHFProvider } from 'react-hook-form';
import { axiosApi } from '../provider/AxiosApi';
import { toast } from 'react-toastify';

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const methods = useForm({ defaultValues: {} });
  const [currentStep, setCurrentStep] = useState(1);

  const [dadosEntrega, setDadosEntrega] = useState({});
  const [imagens, setImagens] = useState([]);
  const [dadosMontagem, setDadosMontagem] = useState({});
  const [valorEstimado, setValorEstimado] = useState(0);

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

  const mapTamanhoToEnum = (tamanho) => {
    const mapping = {
      "11cm": "TAMANHO_5",
      "13cm": "TAMANHO_7", 
      "15cm": "TAMANHO_12",
      "17cm": "TAMANHO_15"
    };
    return mapping[tamanho] || null;
  };

  const mapFormatoToEnum = (formato) => {
    const mapping = {
      "Redondo": "CIRCULO",
      "Coração": "CORACAO"
    };
    return mapping[formato] || null;
  };

  const registerAddress = async (endereco) => {
    try {
      const response = await axiosApi.post("/enderecos", endereco);
      return response.data.id;
    } catch (error) {
      console.error('Erro ao registrar endereço:', error);
      throw error;
    }
  };

  const getOrCreateCobertura = async () => {
    try {
      const response = await axiosApi.get("/bolos/cobertura");
      if (response.data && response.data.length > 0) {
        return response.data[0].id;
      }
    } catch (error) {
      // Create default if none exists
    }

    try {
      const coberturaData = {
        cor: "Branco",
        descricao: "Cobertura padrão"
      };
      const response = await axiosApi.post("/bolos/cobertura", coberturaData);
      return response.data.id;
    } catch (error) {
      console.error('Erro ao criar cobertura padrão:', error);
      return null;
    }
  };

  const registerRecheioPedido = async (recheioData) => {
    try {
      const response = await axiosApi.post("/bolos/recheio-pedido", recheioData);
      return response.data.id;
    } catch (error) {
      console.error('Erro ao registrar recheio pedido:', error);
      throw error;
    }
  };

  const getOrCreateRecheioPedido = async (recheioUnitarioId) => {
    try {
      const response = await axiosApi.get("/bolos/recheio-pedido");
      if (response.data && response.data.length > 0) {
        const recheioExistente = response.data.find(r => 
          r.sabor1 === recheioUnitarioId || r.sabor2 === recheioUnitarioId
        );
        if (recheioExistente) {
          return recheioExistente.id;
        }
        return response.data[0].id;
      }
    } catch (error) {
      // Try creating new
    }

    try {
      const response = await axiosApi.post("/bolos/recheio-unitario", {
        sabor: "Recheio Padrão",
        descricao: "Recheio criado automaticamente", 
        valor: 10.0
      });
      
      if (response.data && response.data.id) {
        return response.data.id;
      }
    } catch (error) {
      // Try fallback
    }

    for (let id of [1, 2, 3, 4, 5]) {
      try {
        const response = await axiosApi.get(`/bolos/recheio-pedido/${id}`);
        if (response.data) {
          return id;
        }
      } catch (error) {
        continue;
      }
    }

    return 1;
  };

  const registerBolo = async (boloData) => {
    try {
      const response = await axiosApi.post("/bolos", boloData);
      return response.data.id;
    } catch (error) {
      console.error('Erro ao registrar bolo:', error);
      throw error;
    }
  };

  const registerPedidoBolo = async (pedidoData) => {
    try {
      const response = await axiosApi.post("/bolos/pedido", pedidoData);
      return response.data.id;
    } catch (error) {
      console.error('Erro ao registrar pedido de bolo:', error);
      throw error;
    }
  };

  const registerResumoPedido = async (resumoData) => {
    try {
      const response = await axiosApi.post("/resumo-pedido", resumoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar resumo do pedido:', error);
      throw error;
    }
  };

  const submitForm = async () => {
    try {
      toast.info("Processando seu pedido...");

      if (!dadosEntrega.nome) {
        toast.warn("Por favor, preencha seu nome!");
        return;
      }
      if (!dadosEntrega.telefone) {
        toast.warn("Por favor, preencha o telefone!");
        return;
      }
      if (!dadosEntrega.data) {
        toast.warn("Por favor, selecione a data de entrega!");
        return;
      }
      if (!dadosMontagem.tamanho) {
        toast.warn("Por favor, selecione o tamanho do bolo!");
        return;
      }
      if (!dadosMontagem.formato) {
        toast.warn("Por favor, selecione o formato do bolo!");
        return;
      }
      if (!dadosMontagem.massaId) {
        toast.warn("Por favor, selecione a massa do bolo!");
        return;
      }
      if (!dadosMontagem.recheioId) {
        toast.warn("Por favor, selecione o recheio do bolo!");
        return;
      }
      if (dadosEntrega.deliveryOption === "Entrega" && !dadosEntrega.cep) {
        toast.warn("Por favor, preencha o CEP para entrega!");
        return;
      }
      if (dadosEntrega.deliveryOption === "Entrega" && (!dadosEntrega.cidade || !dadosEntrega.bairro || !dadosEntrega.rua || !dadosEntrega.numero)) {
        toast.warn("Por favor, preencha todos os campos obrigatórios do endereço!");
        return;
      }
      if (dadosEntrega.deliveryOption === "Retirada" && !dadosEntrega.horario) {
        toast.warn("Por favor, selecione o horário da retirada!");
        return;
      }

      let enderecoId = null;

      if (dadosEntrega.deliveryOption === "Entrega") {
        const endereco = {
          nome: "Endereço de Entrega",
          cep: dadosEntrega.cep.replace("-", ""),
          estado: dadosEntrega.estado || "SP",
          cidade: dadosEntrega.cidade,
          bairro: dadosEntrega.bairro,
          logradouro: dadosEntrega.rua,
          numero: dadosEntrega.numero,
          complemento: dadosEntrega.complemento || "",
          referencia: dadosEntrega.referencia || "",
          usuario: null
        };
        enderecoId = await registerAddress(endereco);
      }

      const coberturaId = await getOrCreateCobertura();
      const recheioPedidoId = await getOrCreateRecheioPedido(dadosMontagem.recheioId);

      const tamanhoMapeado = mapTamanhoToEnum(dadosMontagem.tamanho);
      const formatoMapeado = mapFormatoToEnum(dadosMontagem.formato);

      if (!tamanhoMapeado) {
        toast.error(`Tamanho "${dadosMontagem.tamanho}" não é válido!`);
        return;
      }

      if (!formatoMapeado) {
        toast.error(`Formato "${dadosMontagem.formato}" não é válido!`);
        return;
      }

      const boloData = {
        recheioPedidoId: recheioPedidoId,
        massaId: dadosMontagem.massaId,
        coberturaId: coberturaId,
        decoracaoId: null,
        formato: formatoMapeado,
        tamanho: tamanhoMapeado,
        categoria: "PERSONALIZADO"
      };

      const boloId = await registerBolo(boloData);

      const pedidoData = {
        boloId: boloId,
        usuarioId: null,
        observacao: dadosEntrega.observacoes || "",
        dataPrevisaoEntrega: dadosEntrega.data.replace(/\//g, '-'),
        dataUltimaAtualizacao: new Date().toISOString(),
        tipoEntrega: dadosEntrega.deliveryOption?.toUpperCase() || "ENTREGA",
        nomeCliente: dadosEntrega.nome,
        telefoneCliente: dadosEntrega.telefone,
        enderecoId: enderecoId
      };

      const pedidoId = await registerPedidoBolo(pedidoData);

      const dataEntregaFormatada = dadosEntrega.data.replace(/\//g, '-');
      const resumoData = {
        dataEntrega: dadosEntrega.horario ? 
          `${dataEntregaFormatada}T${dadosEntrega.horario}:00` : 
          `${dataEntregaFormatada}T12:00:00`,
        pedidoBoloId: pedidoId,
        pedidoFornadaId: null
      };

      const resumo = await registerResumoPedido(resumoData);

      const numeroWhatsApp = "11964849864";
      const mensagem = resumo.mensagem;
      const linkWhatsApp = `https://wa.me/55${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

      toast.success("Pedido realizado com sucesso!");
      
      setTimeout(() => {
        window.open(linkWhatsApp, "_blank");
      }, 1000);

    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      
      if (error.response?.status === 422 && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error("Dados inválidos! Verifique se todos os campos estão preenchidos corretamente.");
      } else if (error.response?.status === 404) {
        toast.error("Recurso não encontrado!");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao realizar pedido! Tente novamente.");
      }
    }
  };

  const formDataEntries = {
    ...dadosEntrega,
    ...dadosMontagem,
    adicionais: imagens,
  };

  return (
    <RHFProvider {...methods}>
      <FormContext.Provider value={{ 
        currentStep, 
        nextStep, 
        prevStep, 
        appendFormData, 
        submitForm, 
        formData: formDataEntries,
        valorEstimado,
        setValorEstimado
      }}>
        {children}
      </FormContext.Provider>
    </RHFProvider>
  );
};