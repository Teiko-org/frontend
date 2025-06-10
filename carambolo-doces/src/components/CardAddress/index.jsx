import React, { useState } from "react";
import { IoTrash } from "react-icons/io5";
import Button from "../../components/Button";
import { TbEdit } from "react-icons/tb";
import ModalConfirmationAddressDeletion from "../../components/ModalConfirmationAddressDeletion";
import ModalAddressEdition from "../../components/ModalAddressEdition";

function CardAddress({ endereco, onAddressUpdated, onAddressDeleted }) {
  const [
    isModalConfirmationAddressDeletionOpen,
    setIsModalConfirmationAddressDeletionOpen,
  ] = useState(false);

  const openModalConfirmationAddressDeletion = () =>
    setIsModalConfirmationAddressDeletionOpen(true);
  const closeModalConfirmationAddressDeletion = () =>
    setIsModalConfirmationAddressDeletionOpen(false);

  const [isModalAddressEditionOpen, setIsModalAddressEditionOpen] =
    useState(false);

  const openModalAddressEdition = () => setIsModalAddressEditionOpen(true);
  const closeModalAddressEdition = () => setIsModalAddressEditionOpen(false);

  const handleAddressDeleted = () => {
    if (onAddressDeleted) {
      onAddressDeleted(endereco.id);
    }
    closeModalConfirmationAddressDeletion();
  };

  const handleAddressUpdated = (updatedAddress) => {
    console.log("CardAddress - Endereço atualizado:", updatedAddress);
    if (onAddressUpdated) {
      onAddressUpdated(updatedAddress);
    }
    closeModalAddressEdition();
  };

  // Format CEP for display
  const formatCepForDisplay = (cep) => {
    if (!cep) return "";
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      return `${cleanCep.substring(0, 5)}-${cleanCep.substring(5, 8)}`;
    }
    return cep;
  };

  return (
    <div
      className={`relative w-[620px] h-[372px] border-2 border-gold rounded-2xl bg-bgNativeHome flex-shrink-0`}
    >
      <header className="bg-bgHome relative h-[60px] px-[20px] flex justify-between items-center border-b-2 border-gold rounded-t-2xl">
        <span className="font-medium text-2xl">{endereco.nome || `Endereço #${endereco.id}`}</span>

        <button
          onClick={openModalConfirmationAddressDeletion}
          className="text-red text-3xl"
        >
          <IoTrash />
        </button>

        {isModalConfirmationAddressDeletionOpen && (
          <ModalConfirmationAddressDeletion
            onClose={closeModalConfirmationAddressDeletion}
            endereco={endereco}
            onConfirmDelete={handleAddressDeleted}
          />
        )}
      </header>

      <div className="h-[312px] flex flex-col py-5 px-6">
        <div className="flex-1 flex flex-col gap-3 text-base">
          <div className="w-full flex flex-wrap gap-x-8 gap-y-2">
            <span className="flex-shrink-0">
              <span className="font-semibold text-blue">CEP: </span>{" "}
              {formatCepForDisplay(endereco.cep)}
            </span>
            <span className="flex-shrink-0">
              <span className="font-semibold text-blue">Estado: </span>{" "}
              {endereco.estado}
            </span>
            <span className="flex-shrink-0">
              <span className="font-semibold text-blue">Cidade: </span>{" "}
              {endereco.cidade}
            </span>
          </div>

          <div className="w-full flex flex-wrap gap-x-8 gap-y-2">
            <span className="flex-shrink-0">
              <span className="font-semibold text-blue">Bairro: </span>{" "}
              {endereco.bairro}
            </span>
            <span className="flex-1 min-w-0">
              <span className="font-semibold text-blue">Rua: </span>{" "}
              <span className="break-words">{endereco.logradouro}</span>
            </span>
          </div>

          <div className="w-full">
            <span>
              <span className="font-semibold text-blue">Número: </span>{" "}
              {endereco.numero}
            </span>
          </div>

          <div className="w-full flex flex-wrap gap-x-8 gap-y-2">
            <span className="flex-shrink-0">
              <span className="font-semibold text-blue">Complemento: </span>{" "}
              {endereco.complemento || "Não informado"}
            </span>
            {endereco.referencia && (
              <span className="flex-1 min-w-0">
                <span className="font-semibold text-blue">Referência: </span>{" "}
                <span className="break-words">{endereco.referencia}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={openModalAddressEdition}
            text={
              <span className="flex items-center gap-2">
                Editar <TbEdit className="text-[25px]" />
              </span>
            }
            className="w-fit"
          />

          {isModalAddressEditionOpen && (
            <ModalAddressEdition
              onClose={closeModalAddressEdition}
              endereco={endereco}
              onAddressUpdated={handleAddressUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CardAddress;
