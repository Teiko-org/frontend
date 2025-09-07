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
        const now = new Date();
        const limiteDias = 90; // janela de 90 dias
        const limiteMs = now.getTime() - limiteDias * 24 * 60 * 60 * 1000;
        const maxFuturoMs = now.getTime() + 24 * 60 * 60 * 1000; // tolerância de +1 dia

        const validos = (ultimosPedidos || []).filter((p) => {
          const t = new Date(p.dataPedido).getTime();
          if (isNaN(t)) return false;
          if (t < limiteMs) return false;
          if (t > maxFuturoMs) return false;
          return true;
        });

        const ordenados = validos
          .slice()
          .sort((a, b) => {
            const ta = new Date(a.dataPedido).getTime();
            const tb = new Date(b.dataPedido).getTime();
            if (!isNaN(tb) && !isNaN(ta)) {
              if (tb !== ta) return tb - ta;
              // desempate por id desc se existir
              const ia = Number(a.id); const ib = Number(b.id);
              if (!isNaN(ia) && !isNaN(ib)) return ib - ia;
              return 0;
            }
            // fallback: se faltar data, empurra para o fim
            if (isNaN(ta) && !isNaN(tb)) return 1;
            if (!isNaN(ta) && isNaN(tb)) return -1;
            return 0;
          });
        const top = ordenados.slice(0, 15);
        setPedidos(top);
        
        // Carregar detalhes de todos os pedidos
        const detalhesMap = {};
        for (const pedido of top) {
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
          <div className="text-[11px] opacity-90">Pedidos mais recentes registrados no sistema.</div>
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
        <div className="text-[11px] opacity-90">Pedidos mais recentes registrados no sistema.</div>
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
          onStatusChange={() => {}}
        />
      )}
    </div>
  );
}

export default UltimosPedidos;
