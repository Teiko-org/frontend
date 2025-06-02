import ColumnOrder from "../../components/ColumnOrder";
import BarraLateralDashboard from "../../components/BarraLateralDashboard";

function OrderKanban() {
  
    const orders = [{

        "id": "262626",
        "nome": "Raíne Neres Teixeira Jardim",
        "telefone": "+55 (11) 96809-0282",
        "tipo": "Retirada",
        "valor": 222.99,
        "status": "Cancelado",
        "tamanho": "12cm",
        "formato": "Coração",
        "massa": "Red-Velvet",
        "recheio": "Brigadeiro com Redução de Frutas Vermelhas",
        "imagem": null,
        "observacoes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu mauris, aliquet nec pulvinar a, rhoncus eu tortor. Phasellus at mauris posuere, placerat ante eu, tincidunt libero. Vivamus ultrices porttitor dui.",
        "adicionais": "Cereja, Glitter, Perolado",
        "data": "02/06",
        "cep": "03134-000",
        "estado": "SP",
        "cidade": "São Paulo",
        "bairro": "Jardim Guairaca",
        "rua": "Rua Antônio Marques Julião",
        "numero": "262",
        "complemento": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

    }, {

        "id": "626262",
        "nome": "Vinicius Pajor Marques",
        "telefone": "(11) 22222-0282",
        "tipo": "Entrega",
        "valor": 666.99,
        "status": "Pendente",
        "tamanho": "12cm",
        "formato": "Coração",
        "massa": "Red-Velvet",
        "recheio": "Brigadeiro com Redução de Frutas Vermelhas",
        "imagem": null,
        "observacoes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu mauris, aliquet nec pulvinar a, rhoncus eu tortor. Phasellus at mauris posuere, placerat ante eu, tincidunt libero. Vivamus ultrices porttitor dui.",
        "adicionais": "Cereja, Glitter, Perolado",
        "data": "02/06",
        "cep": "03134-000",
        "estado": "SP",
        "cidade": "São Paulo",
        "bairro": "Jardim Guairaca",
        "rua": "Rua Antônio Marques Julião",
        "numero": "262",
        "complemento": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

    }, {

        "id": "545454",
        "nome": "Samara Lisboa",
        "telefone": "(11) 66666-0282",
        "tipo": "Entrega",
        "valor": 888.99,
        "status": "Pago",
        "tamanho": "12cm",
        "formato": "Coração",
        "massa": "Red-Velvet",
        "recheio": "Brigadeiro com Redução de Frutas Vermelhas",
        "imagem": null,
        "observacoes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu mauris, aliquet nec pulvinar a, rhoncus eu tortor. Phasellus at mauris posuere, placerat ante eu, tincidunt libero. Vivamus ultrices porttitor dui.",
        "adicionais": "Cereja, Glitter, Perolado",
        "data": "02/06",
        "cep": "03134-000",
        "estado": "SP",
        "cidade": "São Paulo",
        "bairro": "Jardim Guairaca",
        "rua": "Rua Antônio Marques Julião",
        "numero": "262",
        "complemento": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

    }, {

        "id": "454545",
        "nome": "Murilo Nascimento",
        "telefone": "(11) 55555-0282",
        "tipo": "Retirada",
        "valor": 111.99,
        "status": "Concluído",
        "tamanho": "12cm",
        "formato": "Coração",
        "massa": "Red-Velvet",
        "recheio": "Brigadeiro com Redução de Frutas Vermelhas",
        "imagem": null,
        "observacoes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu mauris, aliquet nec pulvinar a, rhoncus eu tortor. Phasellus at mauris posuere, placerat ante eu, tincidunt libero. Vivamus ultrices porttitor dui.",
        "adicionais": "Cereja, Glitter, Perolado",
        "data": "02/06",
        "cep": "03134-000",
        "estado": "SP",
        "cidade": "São Paulo",
        "bairro": "Jardim Guairaca",
        "rua": "Rua Antônio Marques Julião",
        "numero": "262",
        "complemento": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

    }, {

        "id": "888888",
        "nome": "Gustavo Aloe",
        "telefone": "(11) 33333-0282",
        "tipo": "Entrega",
        "valor": 333.99,
        "status": "Pendente",
        "tamanho": "12cm",
        "formato": "Coração",
        "massa": "Red-Velvet",
        "recheio": "Brigadeiro com Redução de Frutas Vermelhas",
        "imagem": null,
        "observacoes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu mauris, aliquet nec pulvinar a, rhoncus eu tortor. Phasellus at mauris posuere, placerat ante eu, tincidunt libero. Vivamus ultrices porttitor dui.",
        "adicionais": "Cereja, Glitter, Perolado",
        "data": "02/06",
        "cep": "03134-000",
        "estado": "SP",
        "cidade": "São Paulo",
        "bairro": "Jardim Guairaca",
        "rua": "Rua Antônio Marques Julião",
        "numero": "262",
        "complemento": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

    }, {

        "id": "77777",
        "nome": "Matheus Cantalejo",
        "telefone": "(11) 11111-0282",
        "tipo": "Retirada",
        "valor": 555.99,
        "status": "Pendente",
        "tamanho": "12cm",
        "formato": "Coração",
        "massa": "Red-Velvet",
        "recheio": "Brigadeiro com Redução de Frutas Vermelhas",
        "imagem": null,
        "observacoes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu mauris, aliquet nec pulvinar a, rhoncus eu tortor. Phasellus at mauris posuere, placerat ante eu, tincidunt libero. Vivamus ultrices porttitor dui.",
        "adicionais": "Cereja, Glitter, Perolado",
        "data": "02/06",
        "cep": "03134-000",
        "estado": "SP",
        "cidade": "São Paulo",
        "bairro": "Jardim Guairaca",
        "rua": "Rua Antônio Marques Julião",
        "numero": "262",
        "complemento": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

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
