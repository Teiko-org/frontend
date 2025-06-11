import ModalOrderDetails from "../ModalOrderDetails";
import React, { useEffect, useState } from "react";
import orderCakeDetails from "../../service/orderCakeDetails";
import orderFornadaDetails from "../../service/orderFornadaDetails";

function CardOrder(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const idPedidoBolo = props.order.pedidoBoloId;
  const idPedidoFornada = props.order.pedidoFornadaId;

  const [detalhesPedido, setDetalhesPedido] = useState({});

  const requests = async () => {
    let resposta;

    if (idPedidoBolo > 0) {

      resposta = await orderCakeDetails(idPedidoBolo);
      
    } else if (idPedidoFornada > 0) {

      resposta = await orderFornadaDetails(idPedidoFornada);

    }

    setDetalhesPedido(resposta);

  };

  useEffect(() => {
    requests();
  }, []);

  function formatPhone(phone) {
    if (!phone) return "Carregando...";
    
    const cleaned = phone.replace(/\D/g, "");
    
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  return (
    <div className="flex flex-col justify-center gap-1 p-3 w-[280px] h-[120px] border border-gold rounded-md bg-bgNativeHome">
      <header className="font-semibold">
        {detalhesPedido?.nomeCliente ?? "Carregando..."}
      </header>
      <span>
        {detalhesPedido?.telefoneCliente
          ? formatPhone(detalhesPedido.telefoneCliente)
          : detalhesPedido?.telefone
            ? formatPhone(detalhesPedido.telefone)
            : "Carregando..."}
      </span>
      <span>
        {detalhesPedido?.tipoEntrega === "ENTREGA"
          ? "Entrega"
          : detalhesPedido?.tipoEntrega === "RETIRADA"
            ? "Retirada"
            : "Carregando..."}
      </span>
      <footer className="flex justify-between items-center">
        <span className="font-medium">
          <span className="font-semibold">R$</span>
          {typeof props?.order?.valor === "number"
            ? props.order.valor.toFixed(2).replace('.', ',')
            : "Carregando..."}
        </span>
        <button
          className="border border-gold rounded-md text-gold font-bold px-1"
          onClick={openModal}
        >
          Detalhes
        </button>

        {isModalOpen && (
          <ModalOrderDetails
            onClose={closeModal}
            order={detalhesPedido}
            fornada={idPedidoFornada}
            orderStatus={props.orderStatus}
            orderSummaryId={props.orderSummaryId}
            onStatusChange={props.onStatusChange}
          />
        )}
      </footer>
    </div>
  );
}

export default CardOrder;
