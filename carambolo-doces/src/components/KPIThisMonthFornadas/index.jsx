import Button from "../Button";
import DataKPIFornada from "../DataKPIFornada/DataKPIFornada";

function KPIThisMonthFornadas() {

  return (
    <div className="m-0 h-fit w-fit g-0 bg-gradient-to-l from-gold to-darkGold rounded-2xl border-1 border-gold shadow-md">
      <div
        className={`flex flex-col w-[415px] h-[140px] justify-center border-2 border-gold rounded-2xl bg-bgHome p-5`}
      >

        <div className="flex justify-center gap-x-1">
          <span className="font-bold">Fornadas Deste Mês</span>
        </div>

        <DataKPIFornada />

      </div>

      <button className="p-1 w-full font-bold text-blue rounded-2xl border-none focus:outline-none transform hover:scale-105 transition-transform">
        Consultar Outras Fornadas
      </button>

    </div>
  );
}

export default KPIThisMonthFornadas;