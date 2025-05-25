import ColumnOrder from "../../components/ColumnOrder";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";

function OrderKanban() {

    const orders = [{

        "name": "Raíne Neres Teixeira Jardim",
        "number": "(11) 96809-0282",
        "type": "Retirada",
        "value": 999.99,
        "status": "Cancelado"

    }, {

        "name": "Vinicius Pajor Marques",
        "number": "(11) 96809-0282",
        "type": "Retirada",
        "value": 999.99,
        "status": "Pendente"

    }, {

        "name": "Samara Lisboa",
        "number": "(11) 96809-0282",
        "type": "Retirada",
        "value": 999.99,
        "status": "Pago"

    }, {

        "name": "Murilo Nascimento",
        "number": "(11) 96809-0282",
        "type": "Retirada",
        "value": 999.99,
        "status": "Concluído"

    }, {

        "name": "Gustavo Aloe",
        "number": "(11) 96809-0282",
        "type": "Retirada",
        "value": 999.99,
        "status": "Cancelado"

    }, {

        "name": "Matheus Cantalejo",
        "number": "(11) 96809-0282",
        "type": "Retirada",
        "value": 999.99,
        "status": "Pendente"

    }]

    const filterOrders = (status, order) => {

        return order.status == status;

    }

    const canceledOrders = orders.filter(filterOrders("Cancelado"));

    console.log(canceledOrders);

  return (
    <div className="flex bg-bgNativeHome">
      <BarraLateralDashboard />

      <div className="w-full">
        <header>HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER</header>
        <div className="flex justify-evenly items-center gap-10">
          <ColumnOrder title = "Pedidos Cancelados"/>
          <ColumnOrder title = "Pedidos Pendetes"/>
          <ColumnOrder title = "Pedidos Pagos"/>
          <ColumnOrder title = "Pedidos Concluídos"/>
        </div>
      </div>
    </div>
  );
}

export default OrderKanban;
