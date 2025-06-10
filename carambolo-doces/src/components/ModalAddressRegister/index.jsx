import React, { useEffect, useState } from "react";
import ModalBaseForm from "../ModalBaseForm";
import Button from "../Button";
import axios from "axios";
import { createAddress } from "../../service/addressService";

function ModalAddressRegister({ onClose, onAddressCreated }) {
  const [nome, setNome] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [referencia, setReferencia] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const validateForm = () => {
    if (!nome.trim()) {
      alert("Por favor, insira um nome para o endereço");
      return false;
    }
    if (nome.length > 20) {
      alert("O nome do endereço deve ter no máximo 20 caracteres");
      return false;
    }
    if (!cep.trim()) {
      alert("Por favor, insira o CEP");
      return false;
    }
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      alert("O CEP deve ter exatamente 8 dígitos");
      return false;
    }
    if (!estado.trim()) {
      alert("Por favor, insira o estado");
      return false;
    }
    if (estado.length > 20) {
      alert("O estado deve ter no máximo 20 caracteres");
      return false;
    }
    if (!cidade.trim()) {
      alert("Por favor, insira a cidade");
      return false;
    }
    if (cidade.length > 100) {
      alert("A cidade deve ter no máximo 100 caracteres");
      return false;
    }
    if (!bairro.trim()) {
      alert("Por favor, insira o bairro");
      return false;
    }
    if (bairro.length > 100) {
      alert("O bairro deve ter no máximo 100 caracteres");
      return false;
    }
    if (!rua.trim()) {
      alert("Por favor, insira a rua");
      return false;
    }
    if (rua.length > 100) {
      alert("A rua deve ter no máximo 100 caracteres");
      return false;
    }
    if (!numero.trim()) {
      alert("Por favor, insira o número");
      return false;
    }
    if (numero.length > 6) {
      alert("O número deve ter no máximo 6 caracteres");
      return false;
    }
    if (complemento && complemento.length > 20) {
      alert("O complemento deve ter no máximo 20 caracteres");
      return false;
    }
    if (referencia && referencia.length > 70) {
      alert("A referência deve ter no máximo 70 caracteres");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      
      const addressData = {
        nome,
        cep: cep.replace(/\D/g, ""), 
        estado,
        cidade,
        bairro,
        logradouro: rua,
        numero,
        complemento: complemento.trim() || null,
        referencia: referencia.trim() || null,
        usuario: userId ? parseInt(userId) : null 
      };

      const newAddress = await createAddress(addressData);
      
      if (onAddressCreated) {
        onAddressCreated(newAddress);
      }
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalBaseForm title="Novo Endereço" onClose={onClose}>
        <section className="pb-6">
          <div className="flex flex-col">
            <span className="font-semibold text-blue">Nome</span>
            <input
              type="text"
              placeholder="Insira como gostaria de chamar o seu endereço (máx. 20 caracteres)"
              className="w-[565px] border-2 border-gold rounded-xl px-4 py-2"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={20}
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
              value={cep}
              onChange={handleCepChange}
            />
            <span className="text-sm text-blue">
              Não sabe o CEP?{" "}
              <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
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
              onChange={(e) => setEstado(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="flex flex-col pr-10">
            <span className="font-semibold text-blue">Cidade</span>
            <input
              type="text"
              className="w-48 border-2 border-gold rounded-xl px-4 py-2"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-blue">Bairro</span>
            <input
              type="text"
              className="w-48 border-2 border-gold rounded-xl px-4 py-2"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              maxLength={100}
            />
          </div>
        </section>

        <section className="flex flex-row pb-6">
          <div className="flex flex-col pr-10">
            <span className="font-semibold text-blue">Rua</span>
            <input
              type="text"
              className="w-[400px] border-2 border-gold rounded-xl px-4 py-2"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-blue">Número</span>
            <input
              type="text"
              className="w-32 border-2 border-gold rounded-xl px-4 py-2"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              maxLength={6}
            />
          </div>
        </section>

        <section className="flex flex-row pb-6">
          <div className="flex flex-col pr-10">
            <span className="font-semibold text-blue">Complemento</span>
            <input
              type="text"
              className="w-[270px] border-2 border-gold rounded-xl px-4 py-2"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              placeholder="Apartamento, bloco, etc. (máx. 20)"
              maxLength={20}
            />
          </div>
          
          <div className="flex flex-col">
            <span className="font-semibold text-blue">Referência</span>
            <input
              type="text"
              className="w-[270px] border-2 border-gold rounded-xl px-4 py-2"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder="Ponto de referência (máx. 70)"
              maxLength={70}
            />
          </div>
        </section>

        <footer className="w-full flex justify-end pt-5 text-white font-bold">
          <Button 
            text={isLoading ? "Salvando..." : "Salvar"} 
            onClick={handleSave}
            disabled={isLoading}
          />
        </footer>

      </ModalBaseForm>
    </>
  );
}

export default ModalAddressRegister;

