import Button from "../Button";

function KPIOtherFornadas(props) {

  return (
    <div
      className={`flex w-[415px] h-[140px] justify-center border-2 border-gold rounded-2xl bg-bgNativeHome gap-10`}
    >

        <div className="flex flex-col gap-y-2 justify-center">
            <h3 className="font-bold">Outras Fornadas</h3>
            <span>Rendimento</span>
            <span>Total Vendidos</span>
        </div>

        <div className="flex flex-col items-end justify-end">
            <Button text={"Consultar Fornadas"} textColor="black"/>
        </div>
      
    </div>
  );
}

export default KPIOtherFornadas;