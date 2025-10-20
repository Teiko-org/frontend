import React, { useContext } from "react";
import { FormContext } from "../../contexts/FormContext";
import { useFormContext, Controller } from "react-hook-form";
import Button from "../../components/Button";
import InputImage from "../../components/InputImage";

const Step2 = () => {
  const { nextStep, prevStep, appendFormData, valorEstimado } = useContext(FormContext);
  const { control, handleSubmit, formState: { errors } } = useFormContext();

  const handleNext = (data) => {
  appendFormData({ observacoes: data.observacoes }, 'dadosMontagem');

  const imageFiles = data.images || [];
  appendFormData(imageFiles, 'imagens');

  nextStep();
};

  const handlePrev = () => {
    prevStep();
  };

  return (
    <form onSubmit={handleSubmit(handleNext)}>
      <Controller
        name="images"
        control={control}
        defaultValue={[]}
        render={({ field }) => <InputImage {...field} />}
      />
      <div className="mb-4 mt-6">
        <h2 className="font-semibold tracking-wider text-lg text-blue">
          OBSERVAÇÕES
        </h2>
        <span className="text-blue text-sm">
          Explique, usando suas imagens de referência, COMO você quer o seu Carambolo no formato escolhido (redondo, coração etc.). Informe cores/tema, como aplicar cada imagem e onde vai cada adicional (ex.: glitter na borda, lacinhos na base, cereja no topo). Se quiser frase, escreva exatamente como deve aparecer. Quanto mais específico, mais perfeito ele fica!
        </span>
        <Controller
          name="observacoes"
          control={control}
          defaultValue=""
          rules={{
            required: "Por favor, descreva como você quer o seu Carambolo.",
            minLength: { value: 10, message: "Escreva pelo menos 10 caracteres para entendermos seu pedido." }
          }}
          render={({ field }) => (
            <>
              <textarea
                {...field}
                className="border-2 border-gold rounded-lg px-4 py-2 w-full mt-2 h-32"
                placeholder=""
              ></textarea>
              {errors.observacoes && (
                <p className="text-red-500 text-sm mt-1">{errors.observacoes.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="flex justify-between items-center mt-7">
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

export default Step2;