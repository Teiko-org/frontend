import { useState, useEffect } from "react";
import Button from "../Button";
import DataKPIFornada from "../DataKPIFornada/DataKPIFornada";
import ModalProductsFornada from "../ModalProductsFornada/ModalProductsFornada";
import { getKPIFornadaMaisRecente } from "../../service/kpiService";
import { getLastFornada } from "../../service/fornadaService";

function KPILastFornada({ kpiDataOverride, rangeOverride }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ inicio: null, fim: null });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchKPIData = async () => {
      try {
        setLoading(true);
        const data = await getKPIFornadaMaisRecente();
        setKpiData(data);
        if (data && data.dataInicio && data.dataFim) {
          setRange({ inicio: data.dataInicio, fim: data.dataFim });
        } else {
          const ultima = await getLastFornada();
          if (ultima) {
            setRange({ inicio: ultima.dataInicio, fim: ultima.dataFim });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar KPI da última fornada:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (kpiDataOverride) {
      setKpiData(kpiDataOverride);
      if (rangeOverride?.inicio && rangeOverride?.fim) {
        setRange({ inicio: rangeOverride.inicio, fim: rangeOverride.fim });
      } else if (kpiDataOverride?.dataInicio && kpiDataOverride?.dataFim) {
        setRange({ inicio: kpiDataOverride.dataInicio, fim: kpiDataOverride.dataFim });
      }
      return;
    }
    fetchKPIData();
  }, [kpiDataOverride, rangeOverride]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const [y, m, d] = String(dateString).split('-');
      if (!y || !m || !d) {
        // fallback se não vier como YYYY-MM-DD
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? String(dateString) : date.toLocaleDateString('pt-BR');
      }
      const dd = String(d).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      return `${dd}/${mm}/${y}`;
    } catch (error) {
      return String(dateString);
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
             (range.inicio && range.fim) ? `${formatDate(range.inicio)} - ${formatDate(range.fim)}` : 
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