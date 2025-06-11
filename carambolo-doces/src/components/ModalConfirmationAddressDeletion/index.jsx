import React, { useState } from "react";
import ModalBase from "../ModalBase";
import Button from "../Button";
import { deleteAddress } from "../../service/addressService";

function ModalConfirmationAddressDeletion({ onClose, endereco, onConfirmDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAddress(endereco.id);
      
      if (onConfirmDelete) {
        onConfirmDelete();
      }
      
      onClose();
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ModalBase title="EXCLUSÃO DE ENDEREÇO" onClose={onClose}>
        <span className="text-white px-10 py-10">
          Tem certeza que deseja excluir o endereço "{endereco?.nome || `#${endereco?.id}`}"?
        </span>

        <div className="w-full flex justify-evenly pt-5 text-white font-bold">
          <Button
            text={isDeleting ? "Excluindo..." : "Excluir"}
            bgColor="bg-gradient-to-l from-brightRed to-red"
            fontSize="text-lg"
            textColor="text-white"
            borderColor="border-red"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-[120px]"
          />

          <Button
            text="Cancelar"
            bgColor="bg-gradient-to-l from-brightGreen to-green"
            fontSize="text-lg"
            textColor="text-white"
            borderColor="border-green"
            onClick={onClose}
            disabled={isDeleting}
          />
        </div>
      </ModalBase>
    </>
  );
}

export default ModalConfirmationAddressDeletion;
