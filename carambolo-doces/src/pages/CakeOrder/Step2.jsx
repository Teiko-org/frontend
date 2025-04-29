import React, { useContext } from "react";
import { FormContext } from "../../contexts/FormContext";
import Button from "../../components/Button";
import InputImage from "../../components/InputImage";

const Step2 = () => {
  const { nextStep, prevStep } = useContext(FormContext);

  const handleNext = () => {
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  return (
    <div>
      <InputImage />
      <div className="mb-4 mt-6">
        <h2 className="font-semibold tracking-wider text-lg text-blue">
          OBSERVAÇÕES
        </h2>
        <span className="text-blue text-sm">Escreva abaixo tudo relacionado a o que e como você quer o seu Carambolo</span>
        <textarea
          className="border-2 border-gold rounded-lg px-4 py-2 w-full mt-2 h-32"
          placeholder="Descreva abaixo como você quer o seu Carambolo"
        ></textarea>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-gradient font-bold text-lg">
          VALOR ESTIMADO: R$ 999,99
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
            onClick={handleNext}
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
        </div>
      </div>
    </div>
  );
};

export default Step2;
