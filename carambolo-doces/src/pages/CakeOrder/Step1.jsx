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
    formState: { errors },
  } = useFormContext();

  const [massaOptions, setMassaOptions] = useState([]);
  const [recheioOptions, setRecheioOptions] = useState([]);
  const [massasComValor, setMassasComValor] = useState([]);
  const [recheiosComValor, setRecheiosComValor] = useState([]);
  const [valorMudou, setValorMudou] = useState(false);

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

  const onSubmit = (data) => {
    // Validação adicional para garantir que todos os campos obrigatórios estejam preenchidos
    if (!data.tamanho) {
      console.error("Tamanho é obrigatório");
      return;
    }
    if (!data.formato) {
      console.error("Formato é obrigatório");
      return;
    }
    if (!data.massa) {
      console.error("Massa é obrigatória");
      return;
    }
    if (!data.recheio) {
      console.error("Recheio é obrigatório");
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
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
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
      
      if (bolo.tamanho) {
        const tamanhoFormatado = bolo.tamanho.replace('TAMANHO_', '') + 'cm';
        setValue('tamanho', tamanhoFormatado);
      }
      
      if (bolo.formato) {
        const formatoFormatado = bolo.formato === 'CIRCULO' ? 'Redondo' : 
                                 bolo.formato === 'CORACAO' ? 'Coração' : bolo.formato;
        setValue('formato', formatoFormatado);
      }
      
      if (bolo.massaId) setValue('massa', bolo.massaId);
      if (bolo.recheioPedidoId) setValue('recheio', bolo.recheioPedidoId);
      
      if (bolo.saborMassa) setValue('massa', bolo.saborMassa);
      if (bolo.saborRecheio) setValue('recheio', bolo.saborRecheio);
      
      if (bolo.precoTotal) {
        setValorEstimado(bolo.precoTotal);
      }
    };
    window.addEventListener('fillStep1FromBolo', fillFromBolo);
    return () => window.removeEventListener('fillStep1FromBolo', fillFromBolo);
  }, [setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <h2 className="font-semibold tracking-wider text-lg text-blue">
          TAMANHO
        </h2>
        <div className="flex flex-wrap mt-2 gap-2">
          {sizes.map((size) => (
            <Controller
              key={size}
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
              key={format}
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
          type="submit"
          bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
        />
      </div>
    </form>
  );
};

export default Step1;

