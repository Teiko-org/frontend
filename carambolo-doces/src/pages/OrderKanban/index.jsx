import ColumnOrder from "../../components/ColumnOrder";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import orderSummary from "../../services/orderSummary";
import { useEffect, useState } from "react";
import Button from "../../components/Button";

function OrderKanban() {

  // mostrar imagens no modal de detalhes do pedido
  // versão do modal para Fornada

  const [orders, setOrders] = useState([]);

  const getData = async () => {
    try {
      const data = await orderSummary();
      setOrders(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);


  return (
    <div className="flex bg-bgNativeHome">
      <BarraLateralDashboard />

      <div className="w-full">
        <header>HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER</header>
        <div className="flex justify-evenly items-center gap-10">
          <ColumnOrder title="Pedidos Cancelados" orderFilter={orders?.filter(item => item.status == "CANCELADO")} />
          <ColumnOrder title="Pedidos Pendetes" orderFilter={orders?.filter(item => item.status == "PENDENTE")} />
          <ColumnOrder title="Pedidos Pagos" orderFilter={orders?.filter(item => item.status == "PAGO")} />
          <ColumnOrder title="Pedidos Concluídos" orderFilter={orders?.filter(item => item.status == "CONCLUIDO")} />
        </div>
        <footer className="flex justify-end items-center gap-5 p-5 pr-16 bg-bgNativeHome">
          <Button text={"Gerar Relatório"}></Button>
        </footer>
      </div>
    </div>
  );
}

export default OrderKanban;
