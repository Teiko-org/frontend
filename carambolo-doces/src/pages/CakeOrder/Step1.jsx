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
  const { nextStep, appendFormData } = useContext(FormContext);
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
      } catch (error) {
        console.error("Erro ao buscar recheios:", error);
      }
    };

    fetchMassas();
    fetchRecheios();
  }, []);

  const onSubmit = (data) => {
    const massaSelecionada = massaOptions.find(
      (massa) => massa.value === data.massa
    );
    const recheioSelecionado = recheioOptions.find(
      (recheio) => recheio.value === data.recheio
    );

    const postData = {
      tamanho: data.tamanho,
      formato: data.formato,
      massaId: massaSelecionada ? massaSelecionada.id : null,
      recheioId: recheioSelecionado ? recheioSelecionado.id : null,
    };

    console.log("Dados para POST:", postData);
    appendFormData(postData, "dadosMontagem");
    nextStep();
  };

  const sizes = ["11cm", "13cm", "15cm", "17cm"];
  const formats = ["Redondo", "Coração"];

  const handleButtonClick = (field, value) => (event) => {
    event.preventDefault();
    setValue(field, value);
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
              rules={{ required: "Tamanho é obrigatório" }}
              render={({ field }) => (
                <Button
                  type="button"
                  text={size}
                  onClick={handleButtonClick("tamanho", size)}
                  bgColor={
                    getValues("tamanho") === size
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
              rules={{ required: "Formato é obrigatório" }}
              render={({ field }) => (
                <Button
                  type="button"
                  text={format}
                  onClick={handleButtonClick("formato", format)}
                  bgColor={
                    getValues("formato") === format
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
        <div className="text-gradient font-bold text-lg">
          VALOR ESTIMADO: R$ 999,99
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
