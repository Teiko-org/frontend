import React, { useState } from "react";
import ModalBaseForm from "../ModalBaseForm";
import Button from "../Button";

function ModalAddressRegister({ onClose }) {

  return (
    <>
      <ModalBaseForm title="Edição de Endereço" onClose={onClose}>
        <section className="pb-6">
          <div className="flex flex-col">
            <span className="font-semibold text-blue">Nome</span>
            <input
              type="text"
              className="w-[565px] border-2 border-gold rounded-xl px-4 py-2"
            />
          </div>
        </section>

        <section className="flex flex-row pb-6">
          <div className="flex flex-col">
            <span className="font-semibold text-blue">CEP</span>
            <input
              type="text"
              className="w-32 border-2 border-gold rounded-xl px-4 py-2"
            />
            <span className="text-sm text-blue">
              Não sabe o CEP?{" "}
              <a href="" className="font-semibold underline">
                Clique aqui
              </a>
            </span>
          </div>

          <div className="flex flex-col pr-10">
            <span className="font-semibold text-blue">Estado</span>
            <input
              type="text"
              className="w-24 border-2 border-gold rounded-xl px-4 py-2"
            />
          </div>

          <div className="flex flex-col pr-10">
            <span className="font-semibold text-blue">Cidade</span>
            <input
              type="text"
              className="w-48 border-2 border-gold rounded-xl px-4 py-2"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-blue">Bairro</span>
            <input
              type="text"
              className="w-48 border-2 border-gold rounded-xl px-4 py-2"
            />
          </div>
        </section>

        <section className="flex flex-row pb-6">
          <div className="flex flex-col pr-10">
            <span className="font-semibold text-blue">Rua</span>
            <input
              type="text"
              className="w-[565px] border-2 border-gold rounded-xl px-4 py-2"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-blue">Número</span>
            <input
              type="text"
              className="w-24 border-2 border-gold rounded-xl px-4 py-2"
            />
          </div>
        </section>

        <section>
          <div className="flex flex-col">
            <span className="font-semibold text-blue">Complemento</span>
            <input
              type="text"
              className="w-[565px] border-2 border-gold rounded-xl px-4 py-2"
            />
          </div>
        </section>

        <footer className="w-full flex justify-end pt-5 text-white font-bold">
          <Button text="Salvar" onClick={onClose} />
        </footer>

      </ModalBaseForm>
    </>
  );
}

export default ModalAddressRegister;
