import React, { useState } from "react";
import ModalBase from "../ModalBase";
import Button from "../Button";

function ModalConfirmationLogOff({ onClose }) {

  return (
    <>
      <ModalBase title="DESCONECTAR" onClose={onClose}>
        <span className="text-white px-10 py-10">
            Tem certeza que deseja desconectar da sua conta?
        </span>

        <div className="w-full flex justify-evenly pt-5 text-white font-bold">

          <Button
            text="Sair"
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

export default ModalConfirmationLogOff;
