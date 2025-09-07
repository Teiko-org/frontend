import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "../../contexts/FormContext";
import { useFormContext, Controller } from "react-hook-form";
import Button from "../../components/Button";
import Select from "../../components/Select";
import { axiosApi } from "../../provider/AxiosApi";

const formatLabel = (text) => {
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Step1 = () => {
  const { nextStep, appendFormData, updateDadosMontagem, valorEstimado, setValorEstimado } = useContext(FormContext);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const [massaOptions, setMassaOptions] = useState([]);
  const [recheioOptions, setRecheioOptions] = useState([]);
  const [massasComValor, setMassasComValor] = useState([]);
  const [recheiosComValor, setRecheiosComValor] = useState([]);
  const [valorMudou, setValorMudou] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [camposPreenchidosAutomaticamente, setCamposPreenchidosAutomaticamente] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  // Valores fixos dos tamanhos (baseado no backend)
  const valoresTamanho = {
    "11cm": 50.0,   // TAMANHO_5 -> 50.0 (assumindo 11cm = 5)
    "13cm": 100.0,  // TAMANHO_7 -> 100.0 (assumindo 13cm = 7)
    "15cm": 150.0,  // TAMANHO_12 -> 150.0 (assumindo 15cm = 12)
    "17cm": 200.0   // TAMANHO_15 -> 200.0 (assumindo 17cm = 15)
  };

  useEffect(() => {
    const fetchMassas = async () => {
      try {
        const response = await axiosApi.get("/bolos/massa");
        setMassaOptions(
          response.data.map((massa) => ({
            id: massa.id,
            value: massa.sabor,
            label: formatLabel(massa.sabor),
          }))
        );
        // Salvar massas com valores para cálculo
        setMassasComValor(response.data);
      } catch (error) {
        console.error("Erro ao buscar massas:", error);
      }
    };

    const fetchRecheios = async () => {
      try {
        const response = await axiosApi.get("/bolos/recheio-unitario");
        setRecheioOptions(
          response.data.map((recheio) => ({
            id: recheio.id,
            value: recheio.sabor,
            label: recheio.descricao,
          }))
        );
        // Salvar recheios com valores para cálculo
        setRecheiosComValor(response.data);
      } catch (error) {
        console.error("Erro ao buscar recheios:", error);
      }
    };

    fetchMassas();
    fetchRecheios();
  }, []);

  const handleNextStep = async () => {
    // Limpar erro anterior
    setValidationError("");
    
    // VERIFICAÇÃO CRÍTICA: Se os campos foram preenchidos automaticamente, 
    // o usuário DEVE interagir com pelo menos um campo para continuar
    if (camposPreenchidosAutomaticamente) {
      setValidationError("Por favor, confirme suas escolhas clicando em pelo menos um dos campos (tamanho, formato, massa ou recheio) antes de continuar.");
      return;
    }
    
    // Obter os valores atuais do formulário
    const data = getValues();
    
    // Forçar validação de todos os campos obrigatórios
    const isValid = await trigger(['tamanho', 'formato', 'massa', 'recheio']);
    
    if (!isValid) {
      setValidationError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Validação adicional para garantir que todos os campos obrigatórios estejam preenchidos
    if (!data.tamanho) {
      setValidationError("Por favor, selecione um tamanho");
      return;
    }
    if (!data.formato) {
      setValidationError("Por favor, selecione um formato");
      return;
    }
    if (!data.massa) {
      setValidationError("Por favor, selecione uma massa");
      return;
    }
    if (!data.recheio) {
      setValidationError("Por favor, selecione um recheio");
      return;
    }
    
    const postData = {
      ...data,
      massaId: massaOptions.find((m) => m.value === data.massa)?.id,
      recheioId: recheioOptions.find((r) => r.value === data.recheio)?.id,
    };

    appendFormData(postData, 'dadosMontagem');
    nextStep();
  };

  const sizes = ["11cm", "13cm", "15cm", "17cm"];
  const formats = ["Redondo", "Coração"];

  const handleButtonClick = (field, value) => (event) => {
    event.preventDefault();
    console.log(`Botão clicado - Campo: ${field}, Valor: ${value}`);
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
    clearErrors(field);
    setValidationError(""); // Limpar mensagem de erro quando usuário selecionar
    setCamposPreenchidosAutomaticamente(false); // Marcar que usuário interagiu
    
    // Verificar se o valor foi definido
    setTimeout(() => {
      const currentValue = getValues(field);
      console.log(`Valor atual do campo ${field}:`, currentValue);
    }, 100);
  };

  const availableRecheios = {
    cacau: [
      "Zanza (Ganache meio-amargo e redução de frutas vermelhas)",
      "Marilia (Brigadeiro meio-amargo)",
      "Hugo (Brigadeiro meio-amargo e Brigadeiro de ninho)",
      "Bia Benego (Cocada cremosa de coco queimado)",
      "Gislaine (Brigadeiro meio-amargo e redução de morango)",
      "Nancy (Cocada cremosa e compota de abacaxi)",
      "Priscila (Ganache, caramelo salgado e amendoim tostado)",
      "Sara (Brigadeiro de maracujá e Ganache meio-amargo)",
      "João Donato (Ganache meio-amargo e cupuaçu)",
    ],
    cacau_expresso: ["Devil's Cake (Ganache meio-amargo)"],
    baunilha: [
      "Brunna (Brigadeiro de limão siciliano)",
      "Duda (Brigadeiro de Doce de leite)",
      "Giovanna (Brigadeiro de Pistache)",
      "Juliana (Creme 4 leites e redução de frutas vermelhas)",
      "Ana (Brigadeiro de limão siciliano e redução de frutas vermelhas)",
      "Stefan (Brigadeiro de pistache e Brigadeiro de limão siciliano)",
      "Dora (Brigadeiro de ninho e redução de frutas vermelhas)",
      "Tiramissu (Creamcheese frosting e nuvem de cacau)",
    ],
    red_velvet: ["Creamcheese Frosting"],
  };

  const massaSelecionada = watch("massa", "");
  const tamanhoSelecionado = watch("tamanho", "");
  const recheioSelecionado = watch("recheio", "");
  const formatoSelecionado = watch("formato", "");

  // Função para calcular o valor estimado
  const calcularValorEstimado = () => {
    let valorTotal = 0;

    if (tamanhoSelecionado && valoresTamanho[tamanhoSelecionado]) {
      const valorTamanho = valoresTamanho[tamanhoSelecionado];
      valorTotal += valorTamanho;
    }

    if (massaSelecionada && massasComValor.length > 0) {
      const massa = massasComValor.find(m => m.sabor === massaSelecionada);
      if (massa && massa.valor) {
        valorTotal += massa.valor;
      }
    }

    if (recheioSelecionado && recheiosComValor.length > 0) {
      const recheio = recheiosComValor.find(r => r.sabor === recheioSelecionado);
      if (recheio && recheio.valor) {
        valorTotal += recheio.valor;
      }
    }

    if (valorTotal !== valorEstimado) {
      setValorMudou(true);
      setTimeout(() => setValorMudou(false), 300);
    }
    
    setValorEstimado(valorTotal);
  };

  // Recalcular valor quando qualquer seleção mudar
  useEffect(() => {
    calcularValorEstimado();
  }, [tamanhoSelecionado, massaSelecionada, recheioSelecionado, massasComValor, recheiosComValor]);

  useEffect(() => {
    if (!massaSelecionada) {
      setValue("recheio", "");
    }
  }, [massaSelecionada, setValue]);

  // Forçar re-renderização quando campos são preenchidos automaticamente
  useEffect(() => {
    if (camposPreenchidosAutomaticamente) {
      // Forçar atualização dos valores observados
      const valores = getValues();
      console.log("Forçando re-renderização com valores:", valores);
    }
  }, [camposPreenchidosAutomaticamente, getValues]);

  const filteredRecheios = recheioOptions
    .filter(
      (recheio) =>
        availableRecheios[massaSelecionada] &&
        availableRecheios[massaSelecionada].includes(recheio.label)
    )
    .map((recheio) => ({
      value: recheio.value,
      label: recheio.label,
    }));

  useEffect(() => {
    // Listener para preencher os campos do Step1 ao receber evento
    const fillFromBolo = (e) => {
      const bolo = e.detail;
      
      // Marcar que os campos foram preenchidos automaticamente
      setCamposPreenchidosAutomaticamente(true);
      
      // Usar setTimeout para garantir que o DOM esteja atualizado
      setTimeout(() => {
        if (bolo.tamanho) {
          const tamanhoFormatado = bolo.tamanho.replace('TAMANHO_', '') + 'cm';
          setValue('tamanho', tamanhoFormatado, { shouldValidate: true, shouldDirty: true });
        }
        
        if (bolo.formato) {
          const formatoFormatado = bolo.formato === 'CIRCULO' ? 'Redondo' : 
                                   bolo.formato === 'CORACAO' ? 'Coração' : bolo.formato;
          setValue('formato', formatoFormatado, { shouldValidate: true, shouldDirty: true });
        }
        
        if (bolo.massaId) {
          setValue('massa', bolo.massaId, { shouldValidate: true, shouldDirty: true });
        }
        if (bolo.recheioPedidoId) {
          setValue('recheio', bolo.recheioPedidoId, { shouldValidate: true, shouldDirty: true });
        }
        
        if (bolo.saborMassa) {
          setValue('massa', bolo.saborMassa, { shouldValidate: true, shouldDirty: true });
        }
        if (bolo.saborRecheio) {
          setValue('recheio', bolo.saborRecheio, { shouldValidate: true, shouldDirty: true });
        }
        
        if (bolo.precoTotal) {
          setValorEstimado(bolo.precoTotal);
        }
        
        // Limpar erros de validação após preenchimento
        clearErrors(['tamanho', 'formato', 'massa', 'recheio']);
        
        // Forçar re-renderização dos componentes
        setForceRender(prev => prev + 1);
        
      }, 100);
    };
    window.addEventListener('fillStep1FromBolo', fillFromBolo);
    return () => window.removeEventListener('fillStep1FromBolo', fillFromBolo);
  }, [setValue, clearErrors]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
      <div className="mb-8">
        <h2 className="font-semibold tracking-wider text-lg text-blue">
          TAMANHO
        </h2>
        <div className="flex flex-wrap mt-2 gap-2">
          {sizes.map((size) => (
            <Controller
              key={`${size}-${forceRender}`}
              name="tamanho"
              control={control}
              defaultValue=""
              rules={{ required: "Tamanho é obrigatório" }}
              render={({ field }) => (
                <Button
                  type="button"
                  text={size}
                  onClick={handleButtonClick("tamanho", size)}
                  bgColor={
                    field.value === size
                      ? "bg-gradient-to-l from-darkGoldButton to-goldButton"
                      : "bg-white"
                  }
                />
              )}
            />
          ))}
        </div>
        <div style={{ height: "6px" }}>
          {errors.tamanho && (
            <span className="text-red text-sm">{errors.tamanho.message}</span>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold tracking-wider text-lg text-blue">
          FORMATO
        </h2>
        <div className="flex mt-2 gap-2">
          {formats.map((format) => (
            <Controller
              key={`${format}-${forceRender}`}
              name="formato"
              control={control}
              defaultValue=""
              rules={{ required: "Formato é obrigatório" }}
              render={({ field }) => (
                <Button
                  type="button"
                  text={format}
                  onClick={handleButtonClick("formato", format)}
                  bgColor={
                    field.value === format
                      ? "bg-gradient-to-l from-darkGoldButton to-goldButton"
                      : "bg-white"
                  }
                />
              )}
            />
          ))}
        </div>
        <div style={{ height: "6px" }}>
          {errors.formato && (
            <span className="text-red text-sm">{errors.formato.message}</span>
          )}
        </div>
      </div>

      <div className="mb-8">
        <Controller
          name="massa"
          control={control}
          defaultValue=""
          rules={{ required: "Massa é obrigatória" }}
          render={({ field }) => (
            <Select
              {...field}
              label="MASSA"
              options={massaOptions}
              placeholder="Selecione a massa"
              width="25%"
              value={field.value || ""}
              onChange={(e) => {
                console.log(`Massa selecionada:`, e.target.value);
                field.onChange(e);
                setCamposPreenchidosAutomaticamente(false);
                setValidationError("");
              }}
            />
          )}
        />
        <div style={{ height: "6px" }}>
          {errors.massa && (
            <span className="text-red text-sm">{errors.massa.message}</span>
          )}
        </div>
      </div>

      <div className="mb-12">
        <Controller
          name="recheio"
          control={control}
          defaultValue=""
          rules={{ required: "Recheio é obrigatório" }}
          render={({ field }) => (
            <Select
              {...field}
              label="RECHEIO"
              options={filteredRecheios}
              placeholder="Selecione o Recheio"
              width="100%"
              value={field.value || ""}
              onChange={(e) => {
                console.log(`Recheio selecionado:`, e.target.value);
                field.onChange(e);
                setCamposPreenchidosAutomaticamente(false);
                setValidationError("");
              }}
            />
          )}
        />
        <div style={{ height: "4px" }}>
          {errors.recheio && (
            <span className="text-red text-sm">{errors.recheio.message}</span>
          )}
        </div>
      </div>

              <div className="flex justify-between items-center mt-">
          <div className={`text-gradient font-bold text-lg transition-all duration-300 ${valorMudou ? 'scale-110 text-gold' : ''}`}>
            VALOR ESTIMADO: R$ {valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        <Button
          text="Continuar"
          className="px-6 py-1"
          type="button"
          onClick={handleNextStep}
          bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
        />
      </div>
      
      {/* Mensagem informativa quando campos são preenchidos automaticamente */}
        {camposPreenchidosAutomaticamente && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
            <strong>⚠️ Atenção:</strong> Os campos foram preenchidos automaticamente com base no bolo selecionado. 
            <strong>Você deve clicar em pelo menos um dos campos (tamanho, formato, massa ou recheio) para confirmar suas escolhas antes de continuar.</strong>
          </div>
        )}
      
      {/* Mensagem de erro de validação */}
      {validationError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {validationError}
        </div>
      )}
    </form>
  );
};

export default Step1;

