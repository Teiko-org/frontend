import ModalOrderDetails from "../ModalOrderDetails";
import ModalWrapper from "../ModalWrapper";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import orderCakeDetails from "../../service/orderCakeDetails";
import orderFornadaDetails from "../../service/orderFornadaDetails";

function CardOrder(props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [detalhesPedido, setDetalhesPedido] = useState({});

  const handleOpenModal = () => {
    console.log("🔓 Abrindo modal para pedido:", props.order.id);
    openModal({
      order: props.order,
      detalhesPedido,
      fornada: props.order.pedidoFornadaId,
      orderStatus: props.orderStatus,
      orderSummaryId: props.orderSummaryId,
      onStatusChange: props.onStatusChange
    });
  };

  const idPedidoBolo = props.order.pedidoBoloId;
  const idPedidoFornada = props.order.pedidoFornadaId;

  const requests = async () => {
    try {
      console.log(`🔍 Carregando detalhes - Bolo ID: ${idPedidoBolo}, Fornada ID: ${idPedidoFornada}`);
      let resposta = {};

      if (idPedidoBolo > 0) {
        resposta = await orderCakeDetails(idPedidoBolo);
        console.log("📋 Detalhes do bolo:", resposta);
      } else if (idPedidoFornada > 0) {
        resposta = await orderFornadaDetails(idPedidoFornada);
        console.log("📋 Detalhes da fornada:", resposta);
      }

      setDetalhesPedido(resposta || {});
    } catch (error) {
      console.error("❌ Erro ao carregar detalhes:", error);
      setDetalhesPedido({});
    }
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
    <>
      <div className="flex flex-col justify-center gap-1 p-3 w-[280px] h-[110px] border border-gold rounded-md bg-bgNativeHome relative group card-content">
        {/* Indicador de que pode ser arrastado */}
        <div className="absolute top-2 right-2 text-gray-400 group-hover:text-gold transition-colors duration-200 text-sm draggable-indicator">
          ⋮⋮
        </div>
        
        <header className="font-semibold text-base">
          {detalhesPedido?.nomeCliente ?? "Carregando..."}
        </header>
        <span className="text-sm text-gray-600">
          {detalhesPedido?.telefoneCliente
            ? formatPhone(detalhesPedido.telefoneCliente)
            : detalhesPedido?.telefone
              ? formatPhone(detalhesPedido.telefone)
              : "Carregando..."}
        </span>
        <span className="text-sm text-gray-600">
          {detalhesPedido?.tipoEntrega === "ENTREGA"
            ? "Entrega"
            : detalhesPedido?.tipoEntrega === "RETIRADA"
              ? "Retirada"
              : "Carregando..."}
        </span>
        <footer className="flex justify-between items-center mt-auto card-footer">
          <span className="font-medium text-base">
            <span className="font-semibold">R$</span>
            {typeof props?.order?.valor === "number"
              ? props.order.valor.toFixed(2).replace('.', ',')
              : "Carregando..."}
          </span>
          <button
            className="border border-gold rounded-md text-gold font-bold px-3 py-1 hover:bg-gold hover:text-white transition-colors duration-200 text-sm"
            onClick={handleOpenModal}
          >
            Detalhes
          </button>
        </footer>
      </div>

      {/* Modal usando ModalWrapper robusto */}
      <ModalWrapper isOpen={isOpen} onClose={closeModal}>
        <ModalOrderDetails
          onClose={closeModal}
          order={detalhesPedido}
          fornada={idPedidoFornada}
          orderStatus={props.orderStatus}
          orderSummaryId={props.orderSummaryId}
          onStatusChange={props.onStatusChange}
        />
      </ModalWrapper>
    </>
  );
}

export default CardOrder;
