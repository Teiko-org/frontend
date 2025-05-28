import ColumnOrder from "../../components/ColumnOrder";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";

function OrderKanban() {

    const orders = [{

        "nome": "Raíne Neres Teixeira Jardim",
        "numero": "(11) 96809-0282",
        "tipo": "Retirada",
        "valor": 222.99,
        "status": "Cancelado"

    }, {

        "nome": "Vinicius Pajor Marques",
        "numero": "(11) 22222-0282",
        "tipo": "Entrega",
        "valor": 666.99,
        "status": "Pendente"

    }, {

        "nome": "Samara Lisboa",
        "numero": "(11) 66666-0282",
        "tipo": "Entrega",
        "valor": 888.99,
        "status": "Pago"

    }, {

        "nome": "Murilo Nascimento",
        "numero": "(11) 55555-0282",
        "tipo": "Retirada",
        "valor": 111.99,
        "status": "Concluído"

    }, {

        "nome": "Gustavo Aloe",
        "numero": "(11) 33333-0282",
        "tipo": "Entrega",
        "valor": 333.99,
        "status": "Pendente"

    }, {

        "nome": "Matheus Cantalejo",
        "numero": "(11) 11111-0282",
        "tipo": "Retirada",
        "valor": 555.99,
        "status": "Pendente"

    }]

  return (
    <div className="flex bg-bgNativeHome">
      <BarraLateralDashboard />

      <div className="w-full">
        <header>HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER</header>
        <div className="flex justify-evenly items-center gap-10">
          <ColumnOrder title = "Pedidos Cancelados" orderFilter = {orders.filter(item => item.status == "Cancelado")}/>
          <ColumnOrder title = "Pedidos Pendetes" orderFilter = {orders.filter(item => item.status == "Pendente")}/>
          <ColumnOrder title = "Pedidos Pagos" orderFilter = {orders.filter(item => item.status == "Pago")}/>
          <ColumnOrder title = "Pedidos Concluídos" orderFilter = {orders.filter(item => item.status == "Concluído")}/>
        </div>
      </div>
    </div>
  );
}

export default OrderKanban;
