import React, { useContext } from "react";
import { FormContext } from "../../contexts/FormContext";
import { useFormContext, Controller } from "react-hook-form";
import Button from "../../components/Button";
import InputOption from "../../components/InputOption";

const Step3 = () => {
  const { nextStep, prevStep, appendFormData, formData, valorEstimado } =
    useContext(FormContext);
  const { control, handleSubmit, getValues } = useFormContext();

  const handleNext = (data) => {
    const { adicionais } = data;

    // Salvar os adicionais separadamente, não nas observações
    appendFormData({ adicionais }, "dadosMontagem");

    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleNext)(e);
      }}
    >
      <div className="mb-4">
        <h2 className="font-semibold tracking-wider text-lg text-blue">
          ADICIONAIS
        </h2>
        <p className="text-blue mb-4">
          Selecione quantos adicionais você quiser no seu Carambolo para que ele
          fique ainda mais perfeito
        </p>
        <div className="flex flex-col gap-2">
          {["CEREJA", "GLITTER", "PEROLADO", "LACINHOS"].map((item) => (
            <Controller
              key={item}
              name={`adicionais.${item.toLowerCase()}`}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <InputOption
                  type="checkbox"
                  label={item}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mt-16">
        <div className="text-gradient font-bold text-lg">
          VALOR ESTIMADO: R$ {valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div>
          <Button
            text="Voltar"
            className="mr-4 px-6 py-1"
            onClick={handlePrev}
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
          <Button
            text="Continuar"
            className="px-6 py-1"
            type="submit"
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
        </div>
      </div>
    </form>
  );
};

export default Step3;
