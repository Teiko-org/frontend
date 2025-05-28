import { Draggable } from "@hello-pangea/dnd";

function CardOrder(props) {
  //   const pedido = props.pedido;

  return (
    <div className="flex flex-col justify-center gap-1 p-3 w-[280px] h-[120px] border border-gold rounded-md bg-bgNativeHome">
      <header className="font-semibold">{props.pedido.nome}</header>
      <span>{props.pedido.numero}</span>
      <span>{props.pedido.tipo}</span>
      <footer className="flex justify-between items-center">
        <span className="font-medium">
          <span className="font-semibold">R$</span>{props.pedido.valor}
        </span>
        <button className="border border-gold rounded-md text-gold font-bold px-1">
          Detalhes
        </button>
      </footer>
    </div>
  );
}

export default CardOrder;
