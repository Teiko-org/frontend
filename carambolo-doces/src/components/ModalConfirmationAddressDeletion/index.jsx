import React, { useState } from "react";
import ModalBase from "../ModalBase";
import Button from "../Button";
import { deleteAddress } from "../../service/addressService";

function ModalConfirmationAddressDeletion({ onClose, endereco, onConfirmDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    console.log("🗑️ Iniciando exclusão do endereço:", endereco.id);
    setIsDeleting(true);
    try {
      console.log("📡 Chamando deleteAddress para ID:", endereco.id);
      await deleteAddress(endereco.id);
      console.log("✅ Endereço excluído com sucesso no backend");
      
      // Fechar o modal primeiro
      console.log("🚪 Fechando modal de confirmação");
      onClose();
      
      // Depois chamar o callback para atualizar a lista
      if (onConfirmDelete) {
        console.log("🔄 Chamando callback onConfirmDelete");
        onConfirmDelete();
      }
    } catch (error) {
      console.error("❌ Erro ao excluir endereço:", error);
      console.error("❌ Detalhes do erro:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Em caso de erro, não fechar o modal para que o usuário possa tentar novamente
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ModalBase isOpen={true} title="EXCLUSÃO DE ENDEREÇO" onClose={onClose}>
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
