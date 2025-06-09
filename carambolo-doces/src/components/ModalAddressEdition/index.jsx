import React, { useEffect, useState } from "react";
import ModalBaseForm from "../ModalBaseForm";
import Button from "../Button";
import axios from "axios";
import { updateAddress } from "../../service/addressService";

function ModalAddressEdition({ onClose, endereco, onAddressUpdated }) {
  const [isLoading, setIsLoading] = useState(false);

  const formatCepForDisplay = (cep) => {
    if (!cep) return "";
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      return `${cleanCep.substring(0, 5)}-${cleanCep.substring(5, 8)}`;
    }
    return cep;
  };

  const [nome, setNome] = useState(endereco.nome || "");
  const [cep, setCep] = useState(formatCepForDisplay(endereco.cep) || "");
  const [estado, setEstado] = useState(endereco.estado || "");
  const [cidade, setCidade] = useState(endereco.cidade || "");
  const [bairro, setBairro] = useState(endereco.bairro || "");
  const [rua, setRua] = useState(endereco.logradouro || ""); // Backend uses 'logradouro'
  const [numero, setNumero] = useState(endereco.numero || "");
  const [complemento, setComplemento] = useState(endereco.complemento || "");
  const [referencia, setReferencia] = useState(endereco.referencia || "");

  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      searchAddresByCep(cep);
    }
  }, []);

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
    } else if (cepWithoutMask.length < 8) {
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
        if (!estado || estado !== response.data.uf) setEstado(response.data.uf || estado);
        if (!cidade || cidade !== response.data.localidade) setCidade(response.data.localidade || cidade);
        if (!bairro || bairro !== response.data.bairro) setBairro(response.data.bairro || bairro);
        if (!rua || rua !== response.data.logradouro) setRua(response.data.logradouro || rua);
      } else {
        console.error("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
    }
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
      console.log("Iniciando atualização do endereço:", endereco.id);
      
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
        usuario: endereco.usuario
      };

      console.log("Dados para atualização:", addressData);
      
      const updatedAddress = await updateAddress(endereco.id, addressData);
      console.log("Endereço atualizado com sucesso:", updatedAddress);
      
      if (onAddressUpdated) {
        onAddressUpdated(updatedAddress);
      }
      
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      alert("Erro ao atualizar endereço. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectSave = async () => {
    await handleSave();
  };

  return (
    <>
      <ModalBaseForm title="Edição de Endereço" onClose={onClose}>
        <section className="pb-6">
          <div className="flex flex-col">
            <span className="font-semibold text-blue">Nome</span>
            <input
              type="text"
              className="w-[565px] border-2 border-gold rounded-xl px-4 py-2"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={20}
              placeholder="Nome do endereço (máx. 20 caracteres)"
            />
          </div>
        </section>

        <section className="flex flex-row pb-6">
          <div className="flex flex-col">
            <span className="font-semibold text-blue">CEP</span>
            <input
              type="text"
              className="w-32 border-2 border-gold rounded-xl px-4 py-2"
              value={cep}
              maxLength={9}
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

        <footer className="w-full flex justify-between pt-5 text-white font-bold">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="font-bold py-1 px-4 rounded-full shadow-md focus:outline-none transform hover:scale-105 transition-transform disabled:cursor-not-allowed"
            style={{
              background: '#FF0000',
              border: '2px solid #CC0000',
              color: '#FFFFFF',
              opacity: isLoading ? '0.6' : '1'
            }}
          >
            Cancelar
          </button>
          
          <Button 
            text={isLoading ? "Salvando..." : "Salvar Alterações"} 
            onClick={handleDirectSave}
            disabled={isLoading}
          />
        </footer>
      </ModalBaseForm>
    </>
  );
}

export default ModalAddressEdition;
