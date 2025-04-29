import React, { useState, useContext } from "react";
import { FormContext } from "../../contexts/FormContext";
import Button from "../../components/Button";
import InputOption from "../../components/InputOption";

const Step3 = () => {
  const { nextStep, prevStep } = useContext(FormContext);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const handleCheckboxChange = (item) => {
    setSelectedExtras((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleNext = () => {
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-semibold tracking-wider text-lg text-blue">ADICIONAIS</h2>
        <p className="text-blue mb-4">
          Selecione quantos adicionais você quiser no seu Carambolo para que ele fique ainda mais perfeito
        </p>
        <div className="flex flex-col gap-2">
          {["CEREJA", "GLITTER", "PEROLADO", "LACINHOS"].map((item) => (
            <InputOption
              key={item}
              type="checkbox"
              label={item}
              checked={selectedExtras.includes(item)}
              onChange={() => handleCheckboxChange(item)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mt-16">
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

export default Step3;