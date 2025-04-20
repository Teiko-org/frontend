import React, { useState } from "react";
import { IoTrash } from "react-icons/io5";
import Button from "../../components/Button";
import { TbEdit } from "react-icons/tb";
import ModalConfirmationAddressDeletion from "../../components/ModalConfirmationAddressDeletion";

function CardAddress({
  cep = "00000-000",
  estado = "SP",
  cidade = "São Paulo",
  bairro = "Jardim Guairaca",
  rua = "Rua Antônio Marques Julião",
  numero = "99999",
  complemento = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div
      className={`relative w-[620px] h-[372px] border-2 border-gold rounded-2xl bg-bgNativeHome`}
    >
      <header className="bg-bgHome relative h-[60px] px-[20px] flex justify-between items-center border-b-2 border-gold rounded-t-2xl">
        <span className="font-medium text-2xl">Endereço XPTO</span>

        <button onClick={openModal} className="text-red text-3xl">
          <IoTrash />
        </button>

        {isModalOpen && (
          <ModalConfirmationAddressDeletion onClose={closeModal} />
        )}
      </header>

      <div className="h-[312px] flex flex-col gap-5 text-lg py-5 px-10">
        <div className="w-full flex gap-[70px]">
          <span>
            <span className="font-semibold text-blue">CEP: </span> {cep}
          </span>
          <span>
            <span className="font-semibold text-blue">Estado: </span> {estado}
          </span>
          <span>
            <span className="font-semibold text-blue">Cidade: </span> {cidade}
          </span>
        </div>

        <div className="w-full flex gap-[50px]">
          <span>
            <span className="font-semibold text-blue">Bairro: </span> {bairro}
          </span>
          <span>
            <span className="font-semibold text-blue">Rua: </span> {rua}
          </span>
        </div>

        <span>
          <span className="font-semibold text-blue">Número: </span> {numero}
        </span>

        <div className="w-full flex gap-[70px]">
          <span>
            <span className="font-semibold text-blue">Complemento: </span> {complemento}
          </span>
        </div>

        <div className="flex justify-end">
          <Button
            text={
              <span className="flex items-center gap-2">
                Editar <TbEdit className="text-[25px]" />
              </span>
            }
            className="w-fit"
          />
        </div>
      </div>
    </div>
  );
}

export default CardAddress;
