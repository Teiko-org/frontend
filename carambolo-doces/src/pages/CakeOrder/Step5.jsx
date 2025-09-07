import React, { useState, useContext } from "react";
import { FormContext } from "../../contexts/FormContext";
import Button from "../../components/Button";
import ModalMontagem from "../../components/ModalMontagem";
import ModalDecoracao from "../../components/ModalDecoracao";
import ModalEntregaRetirada from "../../components/ModalEntregaRetirada";
import ModalFinalizar from "../../components/ModalFinalizar";
import { FaEdit } from "react-icons/fa";

const Step5 = () => {
  const { prevStep, submitForm, formData, valorEstimado } = useContext(FormContext);
  
  if (!formData) {
    console.error("formData não está definido");
    return null;
  }

  const formDataEntries = {
    ...formData, 
    adicionais: Array.isArray(formData.adicionais) ? formData.adicionais : []
  };

  const [isModalMontagemOpen, setIsModalMontagemOpen] = useState(false);
  const [isModalDecoracaoOpen, setIsModalDecoracaoOpen] = useState(false);
  const [isModalEntregaRetiradaOpen, setIsModalEntregaRetiradaOpen] = useState(false);
  const [isModalFinalizarOpen, setIsModalFinalizarOpen] = useState(false);

  const formatString = (str) =>
    str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const dateComponents = dateStr.split("/");

    if (dateComponents.length === 3) {
      const [year, month, day] = dateComponents;
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }

    return dateStr;
  };

  const formatRecheio = (str) => {
    if (!str) return "";
    const parts = str.split("-");
    if (parts.length > 1) {
      const nome = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      const descricao = parts
        .slice(1)
        .join(" ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      return `${nome} (${descricao})`;
    } else {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  const montagemData = {
    tamanho: formDataEntries.tamanho || "",
    formato: formDataEntries.formato || "",
    massa: formatString(formDataEntries.massa) || "",
    recheio: formatRecheio(formDataEntries.recheio) || "",
  };

  const decoracaoData = `${formDataEntries.observacoes || "Nenhuma"}`

  const entregaRetiradaData = {
    tipo: formDataEntries.deliveryOption || "",
    nome: formDataEntries.nome || "",
    telefone: formDataEntries.telefone || "",
    data: formDataEntries.data ? formatDate(formDataEntries.data) : "",
    cep: formDataEntries.cep || "",
    estado: formDataEntries.estado || "",
    cidade: formDataEntries.cidade || "",
    bairro: formDataEntries.bairro || "",
    rua: formDataEntries.rua || "",
    numero: formDataEntries.numero || "",
    complemento: formDataEntries.complemento || "",
    horario: formDataEntries.horario || "",
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleFinalizar = () => {
  setIsModalFinalizarOpen(true);
};

const handleConfirmFinalizar = async () => {
  try {
    await submitForm();
  } finally {
    setIsModalFinalizarOpen(false);
  }
};

  return (
    <div className="p-6 bg-bgNativeHome rounded-lg shadow-md">
      <h2 className="text-blue text-2xl mb-6 font-bold">Revise seu pedido</h2>

      {/* MONTAGEM */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">MONTAGEM</h3>
          <FaEdit
            className="text-gold cursor-pointer"
            onClick={() => setIsModalMontagemOpen(true)}
          />
          {isModalMontagemOpen && (
            <ModalMontagem
              isOpen={isModalMontagemOpen}
              onClose={() => setIsModalMontagemOpen(false)}
              selectedSize={montagemData.tamanho}
              selectedShape={montagemData.formato}
              selectedMass={formDataEntries.massa}
              selectedFilling={formDataEntries.recheio}
              onSave={(newData) => {
                setIsModalMontagemOpen(false);
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-10 mb-6">
            <div className="flex flex-col gap-2">
              <span className="text-blue font-semibold">TAMANHO</span>
              <span className="badge">{montagemData.tamanho}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-blue font-semibold">FORMATO</span>
              <span className="badge">{montagemData.formato}</span>
            </div>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-blue font-semibold">MASSA</span>
              {montagemData.massa}
            </div>
            <div className="flex flex-col">
              <span className="text-blue font-semibold">RECHEIO</span>
              {montagemData.recheio}
            </div>
          </div>
        </div>
      </div>

      {/* DECORAÇÃO */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">DECORAÇÃO</h3>
          <FaEdit
            className="text-gold cursor-pointer"
            onClick={() => setIsModalDecoracaoOpen(true)}
          />
          {isModalDecoracaoOpen && (
            <ModalDecoracao onClose={() => setIsModalDecoracaoOpen(false)} />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-blue font-semibold">OBSERVAÇÕES</span>
          {decoracaoData}
        </div>
      </div>

      {/* ENTREGA/RETIRADA */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">DADOS ENTREGA</h3>
          <FaEdit
            className="text-gold cursor-pointer"
            onClick={() => setIsModalEntregaRetiradaOpen(true)}
          />
          {isModalEntregaRetiradaOpen && (
            <ModalEntregaRetirada
              onClose={() => setIsModalEntregaRetiradaOpen(false)}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-y-4 mb-4 text-blue">
          <div>
            <span className="font-semibold">SEU PEDIDO SERÁ:</span>{" "}
            {entregaRetiradaData.tipo}
          </div>
          <div>
            <span className="font-semibold">DATA:</span>{" "}
            {entregaRetiradaData.data}
          </div>
          <div>
            <span className="font-semibold">NOME:</span>{" "}
            {entregaRetiradaData.nome}
          </div>
          <div>
            <span className="font-semibold">TELEFONE:</span>{" "}
            {entregaRetiradaData.telefone}
          </div>
        </div>

        {entregaRetiradaData.tipo === "Entrega" ? (
          <>
            <div className="grid grid-cols-3 mb-4 text-blue">
              <div>
                <span className="font-semibold">CEP:</span>{" "}
                {entregaRetiradaData.cep}
              </div>
              <div>
                <span className="font-semibold">ESTADO:</span>{" "}
                {entregaRetiradaData.estado}
              </div>
              <div>
                <span className="font-semibold">CIDADE:</span>{" "}
                {entregaRetiradaData.cidade}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-blue">
              <div>
                <span className="font-semibold">BAIRRO:</span>{" "}
                {entregaRetiradaData.bairro}
              </div>
              <div>
                <span className="font-semibold">RUA:</span>{" "}
                {entregaRetiradaData.rua}
              </div>
              <div>
                <span className="font-semibold">NÚMERO:</span>{" "}
                {entregaRetiradaData.numero}
              </div>
              <div>
                <span className="font-semibold">COMPLEMENTO:</span>{" "}
                {entregaRetiradaData.complemento}
              </div>
            </div>
          </>
        ) : (
          <div className="text-blue mt-2">
            <span className="font-semibold">Horário para retirada:</span>{" "}
            {entregaRetiradaData.horario}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
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
            text="Finalizar Pedido"
            className="px-6 py-1"
            onClick={handleFinalizar}
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
          {isModalFinalizarOpen && (
            <ModalFinalizar
              isOpen={isModalFinalizarOpen}
              onClose={() => setIsModalFinalizarOpen(false)}
              onFinalize={handleConfirmFinalizar}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Step5;