import ColumnOrder from "../../components/ColumnOrder";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import orderSummary from "../../services/orderSummary";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import HeaderDashboard from "../../components/HeaderDashboard";
import reportService from "../../service/reportService";
import { FaDownload } from "react-icons/fa6";
import "../../styles/kanban-drag-drop.css";
import {
  orderSummaryStatusCancelado,
  orderSummaryStatusConcluido,
  orderSummaryStatusPago,
  orderSummaryStatusPendente,
} from "../../service/orderSummaryStatus";

function OrderKanban() {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    console.log("🔄 Iniciando busca de pedidos (API real)...");
    setIsLoading(true);

    try {
      const data = await orderSummary();
      console.log("✅ Dados recebidos (API):", data);
      console.log("📊 Quantidade de pedidos:", Array.isArray(data) ? data.length : 0);

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Erro ao buscar pedidos:", err);
      setOrders([]);
    } finally {
      console.log("🏁 Finalizando loading...");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [refresh]);

  const handleStatusChange = async (orderId, newStatus) => {
    let previousStatus = null;
    try {
      console.log(`🔄 Iniciando mudança de status: Pedido ${orderId} → ${newStatus}`);

      // Atualização otimista e captura do status anterior
      setOrders((prevOrders) => {
        const updated = prevOrders.map((order) => {
          if (order.id === orderId) {
            previousStatus = order.status;
            return { ...order, status: newStatus };
          }
          return order;
        });
        return updated;
      });

      // Chama API real para alterar o status
      if (newStatus === "CANCELADO") {
        await orderSummaryStatusCancelado(orderId);
      } else if (newStatus === "PENDENTE") {
        await orderSummaryStatusPendente(orderId);
      } else if (newStatus === "PAGO") {
        await orderSummaryStatusPago(orderId);
      } else if (newStatus === "CONCLUIDO") {
        await orderSummaryStatusConcluido(orderId);
      }

      console.log(`✅ Status alterado com sucesso: Pedido ${orderId} → ${newStatus}`);
      // Mantém estado local sem refresh
    } catch (error) {
      console.error(`❌ Erro ao alterar status do pedido ${orderId}:`, error);
      // Reverte para o status anterior
      if (previousStatus) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: previousStatus } : order
          )
        );
      }
    }
  };

  const generateReport = async () => {
    try {
      const response = await reportService({ responseType: "blob" });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio-pedidos.pdf");
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      console.log("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    }
  };

  return (
    <div className="flex bg-bgNativeHome min-h-screen page-background">
      <BarraLateralDashboard />

      <div className="w-full pl-56 flex flex-col min-h-screen">
        <header className="pb-5 bg-bgNativeHome page-header">
          <HeaderDashboard title={"Pedidos"} />
        </header>

        <main className="flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex justify-center items-center py-20 flex-1">
              <div className="text-center">
                <p className="text-xl text-blue mb-4">Carregando pedidos...</p>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex justify-center items-center py-20 flex-1">
              <div className="text-center">
                <p className="text-xl text-blue mb-4">Nenhum pedido encontrado</p>
                <p className="text-gray-600">Verifique se os dados foram inseridos no banco ou se a API está funcionando.</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-evenly items-start gap-10 flex-1 p-6 kanban-columns-container">
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
        </main>

        <footer className="flex justify-end items-center gap-10 p-5 pr-16 bg-bgNativeHome mt-auto page-footer">
          <Button className="w-60" text={"Baixar Relatório"} children={<FaDownload />} onClick={() => generateReport()}></Button>
        </footer>
      </div>
    </div>
  );
}

export default OrderKanban;