import ColumnOrder from "../../components/ColumnOrder";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import orderSummary from "../../services/orderSummary";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import HeaderDashboard from "../../components/HeaderDashboard";

function OrderKanban() {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    console.log("🔄 Iniciando busca de pedidos...");
    setIsLoading(true);
    
    try {
      const data = await orderSummary();
      console.log("✅ Dados recebidos:", data);
      console.log("📊 Quantidade de pedidos:", data?.length || 0);
      
      setOrders(data || []);
    } catch (err) {
      console.error("❌ Erro ao buscar pedidos:", err);
      setOrders([]); // Define array vazio em caso de erro
    } finally {
      console.log("🏁 Finalizando loading...");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [refresh]); 
  
  const handleStatusChange = () => setRefresh((prev) => !prev);


  return (
    <div className="flex bg-bgNativeHome">
      <BarraLateralDashboard />

      <div className="w-full pl-56">
        <header className="pb-5">
          <HeaderDashboard title={"Pedidos"} />
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-xl text-blue mb-4">Carregando pedidos...</p>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-xl text-blue mb-4">Nenhum pedido encontrado</p>
              <p className="text-gray-600">Verifique se os dados foram inseridos no banco ou se a API está funcionando.</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-evenly items-center gap-10">
          <ColumnOrder
            title="Pedidos Cancelados"
            orderFilter={orders?.filter((item) => item.status == "CANCELADO")}
            status={"CANCELADO"}
            onStatusChange={handleStatusChange}
          />
          <ColumnOrder
            title="Pedidos Pendetes"
            orderFilter={orders?.filter((item) => item.status == "PENDENTE")}
            status={"PENDENTE"}
            onStatusChange={handleStatusChange}
          />
          <ColumnOrder
            title="Pedidos Pagos"
            orderFilter={orders?.filter((item) => item.status == "PAGO")}
            status={"PAGO"}
            onStatusChange={handleStatusChange}
          />
          <ColumnOrder
            title="Pedidos Concluídos"
            orderFilter={orders?.filter((item) => item.status == "CONCLUIDO")}
            status={"CONCLUIDO"}
            onStatusChange={handleStatusChange}
                      />
          </div>
        )}

      </div>
    </div>
  );
}

export default OrderKanban;
