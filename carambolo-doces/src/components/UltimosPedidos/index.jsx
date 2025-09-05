import { useState, useEffect } from "react";
import { getUltimosPedidos } from "../../service/dashboardService";
import ModalOrderDetails from "../ModalOrderDetails";
import orderCakeDetails from "../../service/orderCakeDetails";
import orderFornadaDetails from "../../service/orderFornadaDetails";

function UltimosPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detalhesPedidos, setDetalhesPedidos] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        setLoading(true);
        const ultimosPedidos = await getUltimosPedidos();
        setPedidos(ultimosPedidos); // Carregar todos os pedidos para scroll
        
        // Carregar detalhes de todos os pedidos
        const detalhesMap = {};
        for (const pedido of ultimosPedidos) {
          try {
            let detalhes;
            if (pedido.pedidoBoloId) {
              detalhes = await orderCakeDetails(pedido.pedidoBoloId);
            } else if (pedido.pedidoFornadaId) {
              detalhes = await orderFornadaDetails(pedido.pedidoFornadaId);
            }
            if (detalhes) {
              detalhesMap[pedido.id] = detalhes;
            }
          } catch (error) {
            console.error(`Erro ao carregar detalhes do pedido ${pedido.id}:`, error);
          }
        }
        setDetalhesPedidos(detalhesMap);
      } catch (error) {
        console.error("Erro ao carregar últimos pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPedidos();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDetalhesClick = (pedido) => {
    const detalhes = detalhesPedidos[pedido.id];
    if (detalhes) {
      setPedidoSelecionado({
        ...pedido,
        detalhes: detalhes
      });
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setPedidoSelecionado(null);
  };

  if (loading) {
    return (
      <div className="border-2 border-gold rounded-xl overflow-hidden bg-bgHome">
        <div className="bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] text-gold px-5 py-3">
          <div className="text-xl font-bold tracking-wide">Últimos Pedidos</div>
          <div className="text-[11px] opacity-90">Lorem ipsum dolor sit amet</div>
        </div>
        <div className="p-4 h-80 flex items-center justify-center">
          <div className="text-sm text-gray-500">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-gold rounded-xl overflow-hidden bg-bgHome">
      <div className="bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] text-gold px-5 py-3">
        <div className="text-xl font-bold tracking-wide">Últimos Pedidos</div>
        <div className="text-[11px] opacity-90">Lorem ipsum dolor sit amet</div>
      </div>
      <div className="p-4 h-80 flex flex-col">
        {pedidos.length > 0 ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {pedidos.map((pedido, index) => (
              <div key={pedido.id || index} className="bg-bgHome border border-gold/40 rounded-lg p-3 mb-2 last:mb-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 mb-1 text-sm">{pedido.nomeDoCliente}</div>
                    <div className="text-xs text-gray-600 mb-1">{pedido.telefoneDoCliente}</div>
                    <div className="text-xs text-gray-600 mb-1">
                      {pedido.tipoProduto === "FORNADA" ? "Retirada" : String(pedido.tipoDoPedido || "").toLowerCase()}
                    </div>
                    <div className="font-bold text-gray-900 text-sm">{formatCurrency(pedido.valorPedido)}</div>
                  </div>
                  <div className="ml-3">
                    <button 
                      className="bg-bgHome border border-gold/40 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-50 transition-colors"
                      onClick={() => handleDetalhesClick(pedido)}
                    >
                      Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-sm text-gray-500">Nenhum pedido encontrado</div>
          </div>
        )}
      </div>

      {modalOpen && pedidoSelecionado && (
        <ModalOrderDetails
          onClose={closeModal}
          order={pedidoSelecionado.detalhes}
          fornada={pedidoSelecionado.pedidoFornadaId}
          orderStatus={pedidoSelecionado.status}
          orderSummaryId={pedidoSelecionado.id}
          onStatusChange={() => {}} // Não precisamos atualizar status no dashboard
        />
      )}
    </div>
  );
}

export default UltimosPedidos;
