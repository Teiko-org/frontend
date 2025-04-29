import React, { useState } from "react";
import ModalBase from "../ModalBase";
import Button from "../Button";

function ModalConfirmationAccountDeletion({ onClose }) {

  return (
    <>
      <ModalBase title="EXCLUSÃO DE CONTA" onClose={onClose}>
        <span className="text-white p-10">
          Tem certeza que deseja excluir a sua conta?
        </span>

        <div className="w-full flex justify-evenly pt-5 text-white font-bold">

          <Button
            text="Excluir"
            bgColor="bg-gradient-to-l from-brightRed to-red"
            fontSize="text-lg"
            textColor="text-white"
            borderColor="border-red"
            // onClick={onClose}
            className="w-[120px]"
          />

          <Button
            text="Cancelar"
            bgColor="bg-gradient-to-l from-brightGreen to-green"
            fontSize="text-lg"
            textColor="text-white"
            borderColor="border-green"
            onClick={onClose}
          />

        </div>
      </ModalBase>
    </>
  );
}

export default ModalConfirmationAccountDeletion;
