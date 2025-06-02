import ModalOrderDetails from "../ModalOrderDetails";
import { useState } from "react";

function CardOrder(props) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col justify-center gap-1 p-3 w-[280px] h-[120px] border border-gold rounded-md bg-bgNativeHome">
      <header className="font-semibold">{props.pedido.nome}</header>
      <span>{props.pedido.telefone}</span>
      <span>{props.pedido.tipo}</span>
      <footer className="flex justify-between items-center">
        <span className="font-medium">
          <span className="font-semibold">R$</span>{props.pedido.valor}
        </span>
        <button className="border border-gold rounded-md text-gold font-bold px-1"
        onClick={openModal}>
          Detalhes
        </button>

        {isModalOpen && <ModalOrderDetails onClose={closeModal} order={props.pedido}/>}
      </footer>
    </div>
  );
}

export default CardOrder;
