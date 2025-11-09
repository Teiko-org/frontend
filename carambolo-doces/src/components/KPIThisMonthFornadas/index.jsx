import { useState, useEffect } from "react";
import Button from "../Button";
import DataKPIFornada from "../DataKPIFornada/DataKPIFornada";
import ModalOtherFornadas from "../ModalOtherFornadas/ModalOtherFornadas";
import { useNavigate } from "react-router-dom";
import { getKPIFornadasMesAtual, getKPIFornadasPorPeriodo } from "../../service/kpiService";

function KPIThisMonthFornadas({ hideConsultar, mesSelecionado, anoSelecionado }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        setLoading(true);
        const mes = mesSelecionado || new Date().getMonth() + 1;
        const ano = anoSelecionado || new Date().getFullYear();
        const data = await getKPIFornadasPorPeriodo(ano, mes);
        setKpiData(data);
      } catch (error) {
        console.error("Erro ao carregar KPI das fornadas do período:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, [mesSelecionado, anoSelecionado]);

  const getPeriodName = () => {
    const nomesMeses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const mes = mesSelecionado || new Date().getMonth() + 1;
    const ano = anoSelecionado || new Date().getFullYear();
    return `${nomesMeses[mes - 1]} de ${ano}`;
  };

  return (
    <div className="m-0 h-fit w-fit g-0 bg-gradient-to-l from-gold to-darkGold rounded-2xl border-1 border-gold shadow-md">
      <div
        className={`flex flex-col w-[350px] h-[140px] justify-center border-2 border-gold rounded-2xl bg-bgHome p-5`}
      >

        <div className="flex justify-center gap-x-1">
          <span className="font-bold">
            {loading ? "Carregando..." : `Fornadas de ${getPeriodName()}`}
          </span>
        </div>

        <DataKPIFornada kpiData={kpiData} />

      </div>

      {!hideConsultar && (
        <button onClick={() => navigate('/all-fornadas-dashboard')} className="p-1 w-full font-bold text-blue rounded-2xl border-none focus:outline-none transform hover:scale-105 transition-transform">
          Consultar Outras Fornadas
        </button>
      )}

      {/* Modal antigo desativado em favor da navegação */}

    </div>
  );
}

export default KPIThisMonthFornadas;