function CardOrder(/*props*/) {
  //   const pedido = props.pedido;

  return (
    <div className="flex flex-col justify-center gap-1 p-3 w-[280px] h-[120px] border border-gold rounded-md bg-bgNativeHome">
      <header className="font-semibold">Raíne Neres Teixeira Jardim</header>
      <span>+55 (11) 96809-0282</span>
      <span>Retirada</span>
      <footer className="flex justify-between items-center">
        <span className="font-medium">
          <span className="font-semibold">R$</span>999,99
        </span>
        <button className="border border-gold rounded-md text-gold font-bold px-1">
          Detalhes
        </button>
      </footer>
    </div>
  );
}

export default CardOrder;
