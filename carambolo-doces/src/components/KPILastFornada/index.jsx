import Button from "../Button";

function KPILastFornada(props) {

  return (
    <div
      className={`flex w-[415px] h-[140px] justify-center border-2 border-gold rounded-2xl bg-bgNativeHome gap-10`}
    >

        <div className="flex flex-col gap-y-2 justify-center">
            <h3 className="font-bold">Última Fornada</h3>
            <span>Rendimento</span>
            <span>Total Vendidos</span>
        </div>

        <div className="flex flex-col gap-y-1 items-end justify-center">
            <span className="pr-5">De: 99/99/99</span>
            <span className="pr-5">Até: 99/99/99</span>
            <Button text={"Consultar Produtos"} textColor="black"/>
        </div>
      
    </div>
  );
}

export default KPILastFornada;