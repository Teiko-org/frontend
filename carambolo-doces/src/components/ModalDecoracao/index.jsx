import React, { useState, useEffect } from "react";
import Button from "../Button";
import ModalBaseForm from "../ModalBaseForm";
import ModalConfirmarEdicao from "../ModalConfirmarEdicao";
import "./modalDecoracao.css";

export default function ModalDecoration({
  isOpen,
  onClose,
  onSave,
  initialObservations = "",
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const [observations, setObservations] = useState("");

  useEffect(() => {
    if (isOpen) {
      setObservations(initialObservations);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (onSave) {
      onSave({ observations });
    }
    setIsModalOpen(true);
  };

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose} title="DECORAÇÃO">
      {/* OBSERVAÇÕES */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#103464] mb-1">OBSERVAÇÕES</h3>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          className="w-full h-28 p-2 resize-none border-gradient"
          placeholder="Descreva abaixo como você quer o seu Carambolo"
        />
      </div>

      {/* BOTÃO SALVAR */}
      <div className="flex justify-end mt-6">
        <Button
          text="Salvar"
          onClick={handleSave}
          bgColor="bg-gradient-to-l from-gold to-darkGold"
          fontSize="text-sm"
          textColor="text-blue"
          borderColor="border-gold"
        />
        {isModalOpen && <ModalConfirmarEdicao onClose={closeModal} step={"Decoração"} />}
      </div>
    </ModalBaseForm>
  );
}
