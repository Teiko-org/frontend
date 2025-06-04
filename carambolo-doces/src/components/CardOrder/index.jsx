import ModalOrderDetails from "../ModalOrderDetails";
import { useState } from "react";

function CardOrder(props) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col justify-center gap-1 p-3 w-[280px] h-[120px] border border-gold rounded-md bg-bgNativeHome">
      <header className="font-semibold">{props?.order?.nome ?? "Carregando..."}</header>
      <span>{props?.order?.telefone ?? "Carregando..."}</span>
      <span>{props?.order?.tipo ?? "Carregando..."}</span>
      <footer className="flex justify-between items-center">
        <span className="font-medium">
          <span className="font-semibold">R$</span>{props?.order?.valor ?? "Carregando..."}
        </span>
        <button className="border border-gold rounded-md text-gold font-bold px-1"
        onClick={openModal}>
          Detalhes
        </button>

        {isModalOpen && <ModalOrderDetails onClose={closeModal} order={props.order}/>}
      </footer>
    </div>
  );
}

export default CardOrder;
