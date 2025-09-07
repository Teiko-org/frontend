import Button from "../../components/Button";
import { getKPIFornada } from "../../service/dashboardService";
import { useEffect, useState } from "react";

function DashboardFornadaData({ fornada, onConsultar }) {
    const [kpi, setKpi] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (fornada?.id) {
            carregarKPI();
        }
    }, [fornada]);

    const carregarKPI = async () => {
        try {
            setLoading(true);
            const kpiData = await getKPIFornada(fornada.id);
            console.log('[ALL-FORNADAS][CARD] fornada', fornada.id, 'range', fornada.dataInicio, fornada.dataFim, 'kpi', kpiData);
            setKpi(kpiData);
        } catch (error) {
            console.error('Erro ao carregar KPI da fornada:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-fit flex justify-between items-center border-2 border-gold rounded-2xl bg-bgNativeHome px-5 py-2">
                <div className="flex flex-col gap-y-2">
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    if (!fornada || !kpi) {
        return null;
    }

    const formatarData = (data) => {
        if (!data) return '';
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const normalizarIntervalo = (ini, fim) => {
        if (!ini || !fim) return { ini, fim };
        try {
            const a = new Date(ini);
            const b = new Date(fim);
            if (isNaN(a.getTime()) || isNaN(b.getTime())) return { ini, fim };
            return a <= b ? { ini, fim } : { ini: fim, fim: ini };
        } catch { return { ini, fim }; }
    };

    return (
        <div className="w-full h-fit flex justify-between items-center border-2 border-gold rounded-2xl bg-bgNativeHome px-5 py-2">
            <div className="flex flex-col gap-y-2">
                {(() => {
                    const { ini, fim } = normalizarIntervalo(fornada.dataInicio, fornada.dataFim);
                    return (
                        <p><span className="font-semibold">Fornada:</span> {formatarData(ini)} - {formatarData(fim)}</p>
                    );
                })()}

                <div className="flex gap-x-20">
                    <p className="text-sm">Total Vendidos: 
                        <span className="text-green pl-5"> {kpi.quantidadeVendida} </span> / 
                        <span className="text-green"> {kpi.quantidadeDisponivel}</span>
                    </p>
                    <p className="text-sm">Valor Vendido: 
                        <span className="text-green pl-5">R$ {kpi.totalVendido?.toFixed(2) || '0,00'}</span>
                    </p>
                    <p className="text-sm">Valor Perdido: 
                        <span className="text-red pl-5">R$ {kpi.valorPerdido?.toFixed(2) || '0,00'}</span>
                    </p>
                </div>
            </div>
            <div className="flex gap-x-2">
              <Button 
                className="h-fit" 
                variant="outline"
                onClick={() => onConsultar && onConsultar(fornada.id)}
              >
                Consultar produtos
              </Button>
            </div>
        </div>
    );
}

export default DashboardFornadaData;