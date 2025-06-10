import React, { useState, useContext } from "react";
import { FormContext } from "../../contexts/FormContext";
import Button from "../../components/Button";
import ModalMontagem from "../../components/ModalMontagem";
import ModalDecoracao from "../../components/ModalDecoracao";
import ModalAdicionais from "../../components/ModalAdicionais";
import ModalEntregaRetirada from "../../components/ModalEntregaRetirada";
import ModalFinalizar from "../../components/ModalFinalizar";
import { FaEdit } from "react-icons/fa";

const Step5 = () => {
  const { prevStep, submitForm, formData } = useContext(FormContext);

  const [isModalMontagemOpen, setIsModalMontagemOpen] = useState(false);
  const [isModalDecoracaoOpen, setIsModalDecoracaoOpen] = useState(false);
  const [isModalAdicionaisOpen, setIsModalAdicionaisOpen] = useState(false);
  const [isModalEntregaRetiradaOpen, setIsModalEntregaRetiradaOpen] = useState(false);
  const [isModalFinalizarOpen, setIsModalFinalizarOpen] = useState(false);

  const formDataEntries = Object.fromEntries(formData.entries());

  const montagemData = {
    tamanho: formDataEntries.tamanho || "",
    formato: formDataEntries.formato || "",
    massa: formDataEntries.massa || "",
    recheio: formDataEntries.recheio || "",
  };

  const decoracaoData = formDataEntries.observacoes || "Nenhuma";

  const adicionaisData = formDataEntries.adicionais
    ? formDataEntries.adicionais.split(",").map((item) => item.trim())
    : [];

  const entregaRetiradaData = {
    tipo: formDataEntries.deliveryOption || "",
    nome: formDataEntries.nome || "",
    telefone: formDataEntries.telefone || "",
    data: formDataEntries.data || "",
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

  const handleFinalize = () => {
    setIsModalFinalizarOpen(true);
  };

  const handleFinalSubmit = () => {
    submitForm();
    setIsModalFinalizarOpen(false);
  };

  return (
    <div className="p-6 bg-bgNativeHome rounded-lg shadow-md">
      <h2 className="text-blue text-2xl mb-6 font-bold">Revise seu pedido</h2>

      {/* MONTAGEM */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">MONTAGEM</h3>
          <FaEdit className="text-gold cursor-pointer" onClick={() => setIsModalMontagemOpen(true)} />
          {isModalMontagemOpen && <ModalMontagem onClose={() => setIsModalMontagemOpen(false)} />}
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
          <FaEdit className="text-gold cursor-pointer" onClick={() => setIsModalDecoracaoOpen(true)} />
          {isModalDecoracaoOpen && <ModalDecoracao onClose={() => setIsModalDecoracaoOpen(false)} />}
        </div>
        <div className="flex flex-col">
          <span className="text-blue font-semibold">Observações</span>
          {decoracaoData}
        </div>
      </div>

      {/* ADICIONAIS */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">ADICIONAIS</h3>
          <FaEdit className="text-gold cursor-pointer" onClick={() => setIsModalAdicionaisOpen(true)} />
          {isModalAdicionaisOpen && <ModalAdicionais onClose={() => setIsModalAdicionaisOpen(false)} />}
        </div>
        <div className="flex gap-2">
          {adicionaisData.map((item, index) => (
            <span key={index} className="badge">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ENTREGA/RETIRADA */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">DADOS ENTREGA</h3>
          <FaEdit className="text-gold cursor-pointer" onClick={() => setIsModalEntregaRetiradaOpen(true)} />
          {isModalEntregaRetiradaOpen && <ModalEntregaRetirada onClose={() => setIsModalEntregaRetiradaOpen(false)} />}
        </div>
        <div className="grid grid-cols-2 gap-y-4 mb-4 text-blue">
          <div><span className="font-semibold">SEU PEDIDO SERÁ:</span> {entregaRetiradaData.tipo}</div>
          <div><span className="font-semibold">DATA:</span> {entregaRetiradaData.data}</div>
          <div><span className="font-semibold">NOME:</span> {entregaRetiradaData.nome}</div>
          <div><span className="font-semibold">TELEFONE:</span> {entregaRetiradaData.telefone}</div>
        </div>

        {entregaRetiradaData.tipo === "Entrega" ? (
          <>
            <div className="grid grid-cols-3 mb-4 text-blue">
              <div><span className="font-semibold">CEP:</span> {entregaRetiradaData.cep}</div>
              <div><span className="font-semibold">Estado:</span> {entregaRetiradaData.estado}</div>
              <div><span className="font-semibold">Cidade:</span> {entregaRetiradaData.cidade}</div>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-blue">
              <div><span className="font-semibold">Bairro:</span> {entregaRetiradaData.bairro}</div>
              <div><span className="font-semibold">Rua:</span> {entregaRetiradaData.rua}</div>
              <div><span className="font-semibold">Número:</span> {entregaRetiradaData.numero}</div>
              <div><span className="font-semibold">Complemento:</span> {entregaRetiradaData.complemento}</div>
            </div>
          </>
        ) : (
          <div className="text-blue mt-2">
            <span className="font-semibold">Horário para retirada:</span> {entregaRetiradaData.horario}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-gradient font-bold text-lg">VALOR ESTIMADO: R$ 999,99</div>
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
            onClick={handleFinalize}
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
          {isModalFinalizarOpen && (
            <ModalFinalizar
              onClose={() => setIsModalFinalizarOpen(false)}
              onFinalize={handleFinalSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Step5;
