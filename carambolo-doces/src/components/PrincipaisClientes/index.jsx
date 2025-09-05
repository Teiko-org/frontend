import { useState, useEffect } from "react";
import { getUltimosPedidos } from "../../service/dashboardService";

function PrincipaisClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoading(true);
        const pedidos = await getUltimosPedidos();
        
        // Agrupar pedidos por cliente (telefone ou nome)
        const clientesMap = new Map();
        
        pedidos.forEach((pedido) => {
          const key = pedido.telefoneDoCliente || pedido.nomeDoCliente;
          if (key) {
            if (!clientesMap.has(key)) {
              clientesMap.set(key, {
                nome: pedido.nomeDoCliente,
                telefone: pedido.telefoneDoCliente,
                totalPedidos: 0,
                valorTotal: 0
              });
            }
            const cliente = clientesMap.get(key);
            cliente.totalPedidos += 1;
            cliente.valorTotal += pedido.valorPedido || 0;
          }
        });

        // Converter para array e ordenar por total de pedidos
        const clientesArray = Array.from(clientesMap.values())
          .sort((a, b) => b.totalPedidos - a.totalPedidos)
          .slice(0, 3); // Pegar os 3 principais clientes

        setClientes(clientesArray);
      } catch (error) {
        console.error("Erro ao carregar principais clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClientes();
  }, []);

  if (loading) {
    return (
      <div className="border-2 border-gold rounded-xl overflow-hidden bg-bgHome">
        <div className="bg-gradient-to-b from-[#1C3B57] to-[#0F2A3D] text-gold px-5 py-3">
          <div className="text-xl font-bold tracking-wide">Principais Clientes</div>
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
        <div className="text-xl font-bold tracking-wide">Principais Clientes</div>
        <div className="text-[11px] opacity-90">Lorem ipsum dolor sit amet</div>
      </div>
      <div className="p-4 h-80 flex flex-col">
        {clientes.length > 0 ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {clientes.map((cliente, index) => (
              <div key={index} className="bg-bgHome border border-gold/40 rounded-lg p-3 mb-2 last:mb-0">
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-700 mb-1">Nome</div>
                    <div className="text-sm font-bold text-gray-900 mb-1">{cliente.nome}</div>
                    <div className="text-xs text-gray-600 mb-1">Total de Pedidos: {cliente.totalPedidos}</div>
                    <div className="text-xs text-gray-600">{cliente.telefone}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-sm text-gray-500">Nenhum cliente encontrado</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrincipaisClientes;
