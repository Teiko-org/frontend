import React, { createContext, useState } from 'react';
import { useForm, FormProvider as RHFProvider } from 'react-hook-form';
import { axiosApi } from '../provider/AxiosApi';
import { toast } from 'react-toastify';
import { validateBrazilianPhone } from '../utils/phoneValidation';

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
        // Para imagens, substituir ao invés de adicionar para evitar multiplicação
        setImagens(Array.isArray(data) ? data : [data]);
        break;
      case 'dadosMontagem':
        setDadosMontagem((prev) => ({ ...prev, ...data }));
        break;
      default:
        break;
    }
  };

  const setFormData = (data, category) => {
    switch (category) {
      case 'dadosEntrega':
        setDadosEntrega(data);
        break;
      case 'imagens':
        setImagens(Array.isArray(data) ? data : []);
        break;
      case 'dadosMontagem':
        setDadosMontagem(data);
        break;
      default:
        break;
    }
  };

  const mapTamanhoToEnum = (tamanho) => {
    const mapping = {
      "11cm": "TAMANHO_12",  // 11cm mapeia para TAMANHO_12 (mais próximo disponível)
      "13cm": "TAMANHO_12",  // 13cm mapeia para TAMANHO_12 (mais próximo disponível)
      "15cm": "TAMANHO_15",  // 15cm mapeia para TAMANHO_15
      "17cm": "TAMANHO_17"   // 17cm mapeia para TAMANHO_17
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
      const payload = {
        ...endereco,
        cep: (endereco.cep || "").replace(/\D/g, ""),
        numero: endereco.numero != null ? String(endereco.numero).trim() : "",
      };
      const response = await axiosApi.post("/enderecos", payload);
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
      
      // Validação melhorada de telefone
      const phoneValidation = validateBrazilianPhone(dadosEntrega.telefone, { allowCountryCode: true, requireMobile: false });
      if (!phoneValidation.valid) {
        toast.warn(phoneValidation.error || "Telefone inválido!");
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
        toast.error("Por favor, selecione o recheio do bolo!");
        return;
      }
      if (!dadosMontagem.observacoes || dadosMontagem.observacoes.trim().length < 10) {
        toast.warn("Por favor, descreva nas observações como você quer o bolo (mín. 10 caracteres).");
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
      
      // Validar que o recheioId existe antes de processar
      if (!dadosMontagem.recheioId) {
        toast.error("Recheio é obrigatório! Por favor, selecione um recheio.");
        return;
      }
      
      // Criar sempre um registro de recheio-pedido para o recheio selecionado
      let recheioPedidoId = null;
      try {
        const recheioPedidoData = {
          idExclusivo: null,
          // Regra do backend: ou 1 exclusivo OU 2 unitários preenchidos.
          // Como aqui o usuário escolhe 1 recheio unitário, enviamos o mesmo ID nos dois campos.
          idUnitario1: dadosMontagem.recheioId,
          idUnitario2: dadosMontagem.recheioId,
        };
        recheioPedidoId = await registerRecheioPedido(recheioPedidoData);
      } catch (error) {
        console.error('Erro ao processar recheio:', error);
        toast.error("Não foi possível processar o recheio selecionado. Por favor, selecione outro recheio.");
        return;
      }

      if (!recheioPedidoId) {
        toast.error("Não foi possível processar o recheio selecionado. Por favor, selecione outro recheio.");
        return;
      }

      let decoracaoCriadaId = null;
      try {
        if (Array.isArray(imagens) && imagens.length > 0) {
          const formData = new FormData();
          formData.append("nome", "Referência do Cliente");
          formData.append("observacao", dadosMontagem.observacoes || "");
          formData.append("categoria", "REFERENCIA_CLIENTE");
          imagens.forEach((arquivo) => {
            // `imagens` armazena objetos File (vindos do Step2)
            formData.append("imagens", arquivo);
          });

          const resp = await axiosApi.post("/decoracoes", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          decoracaoCriadaId = resp?.data?.id ?? null;
          console.log("✅ Decoração criada com sucesso:", decoracaoCriadaId);

          if (!decoracaoCriadaId) {
            throw new Error("Decoração criada sem ID válido");
          }
        }
      } catch (e) {
        console.error("❌ Erro ao enviar imagens de referência:", e);
        toast.error("Não foi possível salvar a decoração/imagens de referência. Tente novamente.");
        return;
      }

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
        decoracaoId: decoracaoCriadaId,
        formato: formatoMapeado,
        tamanho: tamanhoMapeado,
        categoria: "PERSONALIZADO"
      };

      console.log("🍰 Criando bolo com dados:", boloData);
      const boloId = await registerBolo(boloData);
      console.log("✅ Bolo criado com ID:", boloId);

      // Preparar observação com adicionais
      let observacaoCompleta = dadosMontagem.observacoes || "";
      
      // Adicionar adicionais à observação se existirem
      if (dadosMontagem.adicionais) {
        const adicionaisSelecionados = [];
        if (dadosMontagem.adicionais.cereja) adicionaisSelecionados.push("CEREJA");
        if (dadosMontagem.adicionais.glitter) adicionaisSelecionados.push("GLITTER");
        if (dadosMontagem.adicionais.perolado) adicionaisSelecionados.push("PEROLADO");
        if (dadosMontagem.adicionais.lacinhos) adicionaisSelecionados.push("LACINHOS");
        
        if (adicionaisSelecionados.length > 0) {
          const adicionaisTexto = `Adicionais: ${adicionaisSelecionados.join(", ")}`;
          observacaoCompleta = observacaoCompleta 
            ? `${observacaoCompleta}\n${adicionaisTexto}`
            : adicionaisTexto;
        }
      }

      const pedidoData = {
        boloId: boloId,
        usuarioId: null,
        observacao: observacaoCompleta,
        dataPrevisaoEntrega: dadosEntrega.data.replace(/\//g, '-'),
        dataUltimaAtualizacao: new Date().toISOString(),
        tipoEntrega: dadosEntrega.deliveryOption?.toUpperCase() || "ENTREGA",
        nomeCliente: dadosEntrega.nome,
        telefoneCliente: dadosEntrega.telefone,
        enderecoId: enderecoId,
        horarioRetirada: dadosEntrega.deliveryOption === "Retirada" ? dadosEntrega.horario : null
      };

      const pedidoId = await registerPedidoBolo(pedidoData);

      const dataEntregaFormatada = dadosEntrega.data.replace(/\//g, '-');
      const horarioValido = dadosEntrega.horario && dadosEntrega.horario.trim() !== "";
      const resumoData = {
        dataEntrega: horarioValido ? 
          `${dataEntregaFormatada}T${dadosEntrega.horario}` : 
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
    imagens: imagens,
  };

  return (
    <RHFProvider {...methods}>
      <FormContext.Provider value={{ 
        currentStep, 
        nextStep, 
        prevStep, 
        appendFormData, 
        setFormData,
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