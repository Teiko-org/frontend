import { useState, useEffect } from "react";
import Button from "../Button";
import DataKPIFornada from "../DataKPIFornada/DataKPIFornada";
import ModalOtherFornadas from "../ModalOtherFornadas/ModalOtherFornadas";
import { getKPIFornadasMesAtual } from "../../service/kpiService";

function KPIThisMonthFornadas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        setLoading(true);
        const data = await getKPIFornadasMesAtual();
        setKpiData(data);
      } catch (error) {
        console.error("Erro ao carregar KPI das fornadas do mês:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  const getCurrentMonthName = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="m-0 h-fit w-fit g-0 bg-gradient-to-l from-gold to-darkGold rounded-2xl border-1 border-gold shadow-md">
      <div
        className={`flex flex-col w-[350px] h-[140px] justify-center border-2 border-gold rounded-2xl bg-bgHome p-5`}
      >

        <div className="flex justify-center gap-x-1">
          <span className="font-bold">
            {loading ? "Carregando..." : `Fornadas de ${getCurrentMonthName()}`}
          </span>
        </div>

        <DataKPIFornada kpiData={kpiData} />

      </div>

      <button onClick={openModal} className="p-1 w-full font-bold text-blue rounded-2xl border-none focus:outline-none transform hover:scale-105 transition-transform">
        Consultar Outras Fornadas
      </button>

      {isModalOpen && (
        <ModalOtherFornadas
          onClose={closeModal}
        />
      )}

    </div>
  );
}

export default KPIThisMonthFornadas;