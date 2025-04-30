import React, { useEffect, useState } from "react";
import ModalBaseForm from "../ModalBaseForm";
import Button from "../Button";
import axios from "axios";

function ModalAddressRegister({ onClose }) {

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    <>
      <ModalBaseForm title="Novo Endereço" onClose={onClose}>
        <section className="pb-6">
          <div className="flex flex-col">
            <span className="font-semibold text-blue">Nome</span>
            <input
              type="text"
              placeholder="Insira como gostaria de chamar  o seu endereço"
              className="w-[565px] border-2 border-gold rounded-xl px-4 py-2"
            />
          </div>
        </section>

        <section className="flex flex-row pb-6">
          <div className="flex flex-col">
            <span className="font-semibold text-blue">CEP</span>
            <input
              type="text"
              className="w-32 border-2 border-gold rounded-xl px-4 py-2"
              maxLength={9}
              onChange={handleCepChange}
            />
            <span className="text-sm text-blue">
              Não sabe o CEP?{" "}
              <a href="" className="font-semibold underline">
                Clique aqui
              </a>
            </span>
          </div>

          <div className="flex flex-col pr-10">
            <span className="font-semibold text-blue">Estado</span>
            <input
              type="text"
              className="w-24 border-2 border-gold rounded-xl px-4 py-2"
              value={estado}
              readOnly
            />
          </div>

          <div className="flex flex-col pr-10">
            <span className="font-semibold text-blue">Cidade</span>
            <input
              type="text"
              className="w-48 border-2 border-gold rounded-xl px-4 py-2"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-blue">Bairro</span>
            <input
              type="text"
              className="w-48 border-2 border-gold rounded-xl px-4 py-2"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </section>

        <section className="flex flex-row pb-6">
          <div className="flex flex-col pr-10">
            <span className="font-semibold text-blue">Rua</span>
            <input
              type="text"
              className="w-[565px] border-2 border-gold rounded-xl px-4 py-2"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-blue">Número</span>
            <input
              type="text"
              className="w-24 border-2 border-gold rounded-xl px-4 py-2"
            />
          </div>
        </section>

        <section>
          <div className="flex flex-col">
            <span className="font-semibold text-blue">Complemento</span>
            <input
              type="text"
              className="w-[565px] border-2 border-gold rounded-xl px-4 py-2"
            />
          </div>
        </section>

        <footer className="w-full flex justify-end pt-5 text-white font-bold">
          <Button text="Salvar" onClick={onClose} />
        </footer>

      </ModalBaseForm>
    </>
  );
}

export default ModalAddressRegister;
