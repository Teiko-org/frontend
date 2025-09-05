import { useState, useEffect } from "react";
import Button from "../Button";
import DataKPIFornada from "../DataKPIFornada/DataKPIFornada";
import ModalProductsFornada from "../ModalProductsFornada/ModalProductsFornada";
import { getKPIFornadaMaisRecente } from "../../service/kpiService";

function KPILastFornada() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        setLoading(true);
        const data = await getKPIFornadaMaisRecente();
        setKpiData(data);
      } catch (error) {
        console.error("Erro ao carregar KPI da última fornada:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <div className="m-0 h-fit w-fit g-0 bg-gradient-to-l from-gold to-darkGold rounded-2xl border-1 border-gold shadow-md">
      <div
        className={`flex flex-col w-[350px] h-[140px] justify-center border-2 border-gold rounded-2xl bg-bgHome p-5`}
      >

        <div className="flex justify-center gap-x-1">
          <span className="font-bold">Última Fornada:</span>
          <span>
            {loading ? "Carregando..." : 
             kpiData ? `${formatDate(kpiData.dataInicio)} - ${formatDate(kpiData.dataFim)}` : 
             "Nenhuma fornada encontrada"}
          </span>
        </div>

        <DataKPIFornada kpiData={kpiData} />

      </div>

      <button onClick={openModal} className="p-1 w-full font-bold text-blue rounded-2xl border-none focus:outline-none transform hover:scale-105 transition-transform">Consultar Produtos</button>

      {isModalOpen && (
        <ModalProductsFornada
          onClose={closeModal}
        />
      )}

    </div>
  );
}

export default KPILastFornada;