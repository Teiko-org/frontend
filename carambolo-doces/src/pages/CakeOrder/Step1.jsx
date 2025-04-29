import React, { useState, useContext } from "react";
import { FormContext } from "../../contexts/FormContext";
import Button from "../../components/Button";
import Select from "../../components/Select";

const Step1 = () => {
  const { nextStep } = useContext(FormContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);

  const handleNext = () => {
    nextStep();
  };

  const sizes = ["11cm", "13cm", "15cm", "17cm"];
  const formats = ["Redondo", "Coração"];

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-semibold tracking-wider text-lg text-blue">
          TAMANHO
        </h2>
        <div className="flex flex-wrap space-x-4 mt-2">
          {sizes.map((size) => (
            <Button
              key={size}
              text={size}
              onClick={() => setSelectedSize(size)}
              bgColor={
                selectedSize === size
                  ? "bg-gradient-to-l from-darkGoldButton to-goldButton"
                  : "bg-white"
              }
            />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="font-semibold tracking-wider text-lg text-blue">
          FORMATO
        </h2>
        <div className="flex space-x-4 mt-2">
          {formats.map((format) => (
            <Button
              key={format}
              text={format}
              onClick={() => setSelectedFormat(format)}
              bgColor={
                selectedFormat === format
                  ? "bg-gradient-to-l from-darkGoldButton to-goldButton"
                  : "bg-white"
              }
            />
          ))}
        </div>
      </div>
      <div className="mb-8">
      <Select 
          label="MASSA" 
          options={[
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'baunilha', label: 'Baunilha' },
            { value: 'red_velvet', label: 'Red Velvet' }
          ]}
          placeholder="Selecione a massa"
          width="25%"
        />
      </div>
      <div className="mb-12">
      <Select 
          label="RECHEIO" 
          options={[
            { value: 'brigadeiro', label: 'Brigadeiro' },
            { value: 'doce_de_leite', label: 'Doce de Leite' }
          ]}
          placeholder="Selecione o Recheio"
          width="100%"
        />
      </div>
      <div className="flex justify-between items-center mt-16">
        <div className="text-gradient font-bold text-lg">VALOR ESTIMADO: R$ 999,99</div>
        <Button
          text="Continuar"
          className="px-6 py-1"
          onClick={handleNext}
          bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
        />
      </div>
    </div>
  );
};

export default Step1;