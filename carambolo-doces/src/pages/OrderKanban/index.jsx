import ColumnOrder from "../../components/ColumnOrder";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import orderSummary from "../../services/orderSummary";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import HeaderDashboard from "../../components/HeaderDashboard";
import reportService from "../../service/reportService";
import { FaDownload } from "react-icons/fa6";

function OrderKanban() {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getData = async () => {
    try {
      const data = await orderSummary();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [refresh]); 
  
  const handleStatusChange = () => setRefresh((prev) => !prev);

const generateReport = async () => {
  try {
    const response = await reportService({ responseType: "blob" });

    const blob = new Blob([response.data], { type: 'application/pdf' });
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
}

  return (
    <div className="flex bg-bgNativeHome">
      <BarraLateralDashboard />

      <div className="w-full pl-56">
        <header className="pb-5">
          <HeaderDashboard title={"Pedidos"} />
        </header>
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
        <footer className="flex justify-end items-center gap-5 p-5 pr-16 bg-bgNativeHome">
          <Button text={"Baixar Relatório"} children={<FaDownload/>} onClick={() => generateReport()}> </Button>
        </footer>
      </div>
    </div>
  );
}

export default OrderKanban;
