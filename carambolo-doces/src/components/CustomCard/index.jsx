import React, { useEffect, useState } from "react";
import orderCakeDetails from "../../service/orderCakeDetails";
import orderFornadaDetails from "../../service/orderFornadaDetails";

function CustomCard({ card, metadata, laneId }) {
  const [detalhesPedido, setDetalhesPedido] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const order = metadata?.order;
  const idPedidoBolo = order?.pedidoBoloId;
  const idPedidoFornada = order?.pedidoFornadaId;

  const requests = async () => {
    try {
      setIsLoading(true);
      console.log(`🔍 Carregando detalhes - Bolo ID: ${idPedidoBolo}, Fornada ID: ${idPedidoFornada}`);
      
      let resposta;

      if (idPedidoBolo > 0) {
        resposta = await orderCakeDetails(idPedidoBolo);
        console.log("📋 Detalhes do bolo:", resposta);
      } else if (idPedidoFornada > 0) {
        resposta = await orderFornadaDetails(idPedidoFornada);
        console.log("🍰 Detalhes da fornada:", resposta);
      }

      setDetalhesPedido(resposta || {});
    } catch (error) {
      console.error("❌ Erro ao carregar detalhes:", error);
      setDetalhesPedido({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (order) {
      requests();
    }
  }, [order]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'CANCELADO':
        return 'border-red-500 bg-red-50';
      case 'PENDENTE':
        return 'border-yellow-500 bg-yellow-50';
      case 'PAGO':
        return 'border-blue-500 bg-blue-50';
      case 'CONCLUIDO':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="p-3 bg-white rounded-md border border-gray-200 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 bg-white rounded-md border-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${getStatusColor(metadata?.status)}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-sm">
          {detalhesPedido?.nomeCliente || `Pedido #${order?.id}`}
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          #{order?.id}
        </span>
      </div>
      
      <div className="space-y-1 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <span className="font-medium">📞</span>
          <span>
            {detalhesPedido?.telefoneCliente
              ? formatPhone(detalhesPedido.telefoneCliente)
              : detalhesPedido?.telefone
                ? formatPhone(detalhesPedido.telefone)
                : "N/A"}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="font-medium">🚚</span>
          <span>
            {detalhesPedido?.tipoEntrega === "ENTREGA"
              ? "Entrega"
              : detalhesPedido?.tipoEntrega === "RETIRADA"
                ? "Retirada"
                : "N/A"}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="font-medium">💰</span>
          <span className="font-semibold text-gray-800">
            R$ {typeof order?.valor === "number"
              ? order.valor.toFixed(2).replace('.', ',')
              : "0,00"}
          </span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Clique para ver detalhes
        </span>
      </div>
    </div>
  );
}

export default CustomCard;

