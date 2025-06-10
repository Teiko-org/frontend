import React from "react";
import ModalBase from "../ModalBase";
import Button from "../Button";

function ModalConfirmationAddressEdit({ onClose, onConfirm }) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <>
      <ModalBase title="EDIÇÃO DE ENDEREÇO" onClose={onClose}>
        <span className="text-white px-10 py-10">
          Tem certeza que deseja salvar as alterações no endereço?
        </span>

        <div className="w-full flex justify-evenly pt-5 text-white font-bold">
          <Button
            text="Confirmar"
            bgColor="bg-gradient-to-l from-brightGreen to-green"
            fontSize="text-lg"
            textColor="text-white"
            borderColor="border-green"
            onClick={handleConfirm}
          />

          <Button
            text="Cancelar"
            bgColor="bg-gradient-to-l from-brightRed to-red"
            fontSize="text-lg"
            textColor="text-white"
            borderColor="border-red"
            onClick={onClose}
            className="w-[120px]"
          />
        </div>
      </ModalBase>
    </>
  );
}

export default ModalConfirmationAddressEdit;
