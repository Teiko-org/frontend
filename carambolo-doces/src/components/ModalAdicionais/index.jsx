import React, { useState, useEffect } from "react";
import ModalBaseForm from "../ModalBaseForm";
import ModalConfirmarEdicao from "../ModalConfirmarEdicao";
import Button from "../Button";

export default function ModalAdicionais({ 
  isOpen, 
  onClose, 
  onSave, 
  initialAddons = {},
  adicionaisDisponiveis = [],
  selectedAdicionais = []
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  // Initialize state based on available adicionais
  const [addons, setAddons] = useState({});

  useEffect(() => {
    console.log("🎁 ModalAdicionais recebeu:", {
      adicionaisDisponiveis,
      selectedAdicionais
    });

    // Create a map of selected adicionais by ID for faster lookup
    const selectedIds = new Set(
      selectedAdicionais.map(a => a.id || a.name)
    );

    console.log("✅ IDs selecionados:", Array.from(selectedIds));

    // Create initial state from available adicionais
    const newAddons = {};
    adicionaisDisponiveis.forEach((adicional) => {
      newAddons[adicional.id] = selectedIds.has(adicional.id);
    });

    console.log("📋 Estado de addons criado:", newAddons);
    setAddons(newAddons);
  }, [adicionaisDisponiveis, selectedAdicionais]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAddons((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      // Convert selected adicionais back to array format
      const selectedAdicionaisArray = adicionaisDisponiveis.filter(
        (adicional) => addons[adicional.id]
      );
      onSave(selectedAdicionaisArray);
    }
    setIsModalOpen(true);
  };

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose} title="ADICIONAIS">
      <div className="flex flex-wrap gap-6 mb-4 mt-7">
        {adicionaisDisponiveis.length > 0 ? (
          adicionaisDisponiveis.map((adicional) => (
            <label
              key={adicional.id}
              className="flex items-center gap-2 text-[#1d1d1d] text-sm font-semibold cursor-pointer"
            >
              <input
                type="checkbox"
                name={adicional.id}
                checked={addons[adicional.id] || false}
                onChange={handleCheckboxChange}
                className="sr-only"
              />
              <span
                className="w-5 h-5 rounded-sm p-[1px]"
                style={{
                  background: "linear-gradient(180deg, #A47032 0%, #D4B076 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="w-full h-full rounded-[1px] flex items-center justify-center"
                  style={{
                    background: addons[adicional.id]
                      ? "linear-gradient(180deg, #A47032 0%, #D4B076 100%)"
                      : "#fff",
                    transition: "all 0.2s ease",
                  }}
                >
                  {addons[adicional.id] && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              </span>
              {adicional.descricao}
            </label>
          ))
        ) : (
          <div className="text-blue">Nenhum adicional disponível</div>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <Button
          text="Salvar"
          onClick={handleSave}
          bgColor="bg-gradient-to-l from-gold to-darkGold"
          fontSize="text-sm"
          textColor="text-blue"
          borderColor="border-gold"
        />
        {isModalOpen && <ModalConfirmarEdicao onClose={closeModal} step={"Adicionais"} />}
      </div>
    </ModalBaseForm>
  );
}
