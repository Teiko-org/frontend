import React, { useState, useContext, useEffect } from "react";
import { FormContext } from "../../contexts/FormContext";
import Button from "../../components/Button";
import Select from "../../components/Select";
import InputOption from "../../components/InputOption";
import CustomDatePicker from "../../components/DatePicker";
import PhoneNumberInput from "../../components/PhoneInput";
import CampoComGradiente from "../../components/gradientField";
import axios from "axios";

const Step4 = () => {
  const [deliveryOption, setDeliveryOption] = useState("Entrega");
  const { nextStep, prevStep } = useContext(FormContext);

  const handleNext = () => {
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");

  useEffect(() => {
    if (cep.length === 8) {
      searchAddresByCep(cep);
    }
  }, [cep]);

  const formatCep = (value) => {
    const cleanCep = value.replace(/\D/g, "");
    if (cleanCep.length <= 5) {
      return cleanCep;
    }
    return `${cleanCep.substring(0, 5)}-${cleanCep.substring(5, 8)}`;
  };

  const handleCepChange = (e) => {
    const formattedValue = formatCep(e.target.value);
    setCep(formattedValue);

    const cepWithoutMask = formattedValue.replace(/\D/g, "");

    if (cepWithoutMask.length === 8) {
      searchAddresByCep(formattedValue);
    } else {
      cleanAddressFields();
    }
  };

  const searchAddresByCep = async (typedCep) => {
    try {
      const cepOnlyNumbers = typedCep.replace(/\D/g, "");

      if (cepOnlyNumbers.length !== 8) {
        return;
      }

      const response = await axios.get(
        `https://viacep.com.br/ws/${cepOnlyNumbers}/json/`
      );

      if (response.data && !response.data.erro) {
        setEstado(response.data.uf || "");
        setCidade(response.data.localidade || "");
        setBairro(response.data.bairro || "");
        setRua(response.data.logradouro || "");
      } else {
        console.error("CEP não encontrado.");
        cleanAddressFields();
      }
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
      cleanAddressFields();
    }
  };

  const cleanAddressFields = () => {
    setEstado("");
    setCidade("");
    setBairro("");
    setRua("");
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex space-x-4 mt-2 mb-4">
          <h2 className="font-semibold tracking-wider text-xl text-blue">
            Seu pedido será?
          </h2>
          {["Entrega", "Retirada"].map((option) => (
            <InputOption
              key={option}
              type="radio"
              label={option}
              checked={deliveryOption === option}
              onChange={() => setDeliveryOption(option)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label className="block text-blue font-semibold mb-1">Nome</label>
          <input
            placeholder="Inserir o seu nome"
            className="border-2 border-gold rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div className="col-span-4">
          <label className="block text-blue font-semibold mb-1">Telefone</label>
          <CampoComGradiente>
            <PhoneNumberInput
              placeholder="(XX) X XXXX-XXXX"
              className="border-2 border-gold rounded-lg px-4 py-2 w-full"
            />
          </CampoComGradiente>
        </div>
        <div className="col-span-2">
          <CustomDatePicker label="Data" placeholder="DD/MM" />
        </div>

        {deliveryOption === "Entrega" && (
          <>
            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">CEP</label>
              <input
                placeholder="00000-000"
                className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                value={cep}
                maxLength={9}
                onChange={handleCepChange}
              />
              <span className="text-xs text-blue mt-1">
                Não sabe o CEP?{" "}
                <a
                  href="https://www.buscacep.correios.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue font-semibold underline"
                >
                  Clique Aqui
                </a>
              </span>
            </div>
            <div className="col-span-2">
              <Select
                label="Estado"
                options={[{ value: "SP", label: "SP" }]}
                defaultValue="SP"
                disabled={true}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">
                Cidade
              </label>
              <input
                className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">
                Bairro
              </label>
              <input
                className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>

            <div className="col-span-8">
              <label className="block text-blue font-semibold mb-1">
                Endereço
              </label>
              <input
                placeholder="Inserir seu endereço"
                className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">
                Número
              </label>
              <input className="border-2 border-gold rounded-lg px-4 py-2 w-full" />
            </div>

            <div className="col-span-8">
              <label className="block text-blue font-semibold mb-1">
                Complemento
              </label>
              <input className="border-2 border-gold rounded-lg px-4 py-2 w-full" />
            </div>
          </>
        )}
        {deliveryOption === "Retirada" && (
          <div className="col-span-2">
            <Select
              label="Horário"
              options={[
                { value: "17:00", label: "17:00" },
                { value: "17:30", label: "17:30" },
                { value: "18:00", label: "18:00" },
                { value: "18:30", label: "18:30" },
                { value: "19:00", label: "19:00" },
              ]}
              placeholder={""}
            />
          </div>
        )}
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

export default Step4;
