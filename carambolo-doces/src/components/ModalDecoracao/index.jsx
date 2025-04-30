import React, { useState, useEffect } from "react";
import { FaFileAlt } from "react-icons/fa";
import Button from "../Button";
import ModalBaseForm from "../ModalBaseForm";
import ModalConfirmarEdicao from "../ModalConfirmarEdicao";
import "./modalDecoracao.css";

export default function ModalDecoration({
  isOpen,
  onClose,
  onSave,
  initialObservations = "",
  initialReferences = [],
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const [observations, setObservations] = useState("");
  const [references, setReferences] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setObservations(initialObservations);
      setReferences(initialReferences);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setReferences((prevRefs) => [...prevRefs, ...files]);
  };

  const handleSave = () => {
    // onSave({ observations, references });
    setIsModalOpen(true);
  };

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose} title="DECORAÇÃO">
      {/* REFERÊNCIAS */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#103464] mb-1">REFERÊNCIAS</h3>
        <div className="w-full min-h-[150px] flex flex-wrap items-start gap-4 px-4 py-3 bg-white rounded-lg border-gradient overflow-auto">
          {references.length > 0 ? (
            references.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-[#103464] text-sm"
              >
                <FaFileAlt className="text-xl" />
                <span className="truncate max-w-[150px]">{file.name}</span>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500">
              Nenhum arquivo selecionado
            </span>
          )}
        </div>

        {/* Botão estilizado */}
        <div className="mt-3">
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block px-4 py-2 text-sm font-semibold text-white bg-gradient-to-l from-gold to-darkGold rounded-md shadow hover:opacity-90 transition"
          >
            Escolher Arquivos
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

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
