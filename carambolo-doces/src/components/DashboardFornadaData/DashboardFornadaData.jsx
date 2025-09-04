import Button from "../../components/Button";
import { getKPIFornada } from "../../service/dashboardService";
import { useEffect, useState } from "react";

function DashboardFornadaData({ fornada, onConsultar, onEncerrar }) {
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

    return (
        <div className="w-full h-fit flex justify-between items-center border-2 border-gold rounded-2xl bg-bgNativeHome px-5 py-2">
            <div className="flex flex-col gap-y-2">
                <p><span className="font-semibold">Fornada:</span> {formatarData(fornada.dataInicio)} - {formatarData(fornada.dataFim)}</p>

                <div className="flex gap-x-20">
                    <p className="text-sm">Total Vendidos: 
                        <span className="text-green pl-5"> {kpi.quantidadeVendida} </span> / 
                        <span className="text-green"> {kpi.quantidadeDisponivel}</span>
                    </p>
                    <p className="text-sm">Valor Total: 
                        <span className="text-green pl-5">R$ {kpi.totalVendido?.toFixed(2) || '0,00'} </span> / 
                        <span className="text-green">R$ {kpi.totalDisponivel?.toFixed(2) || '0,00'}</span>
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
                Consultar
              </Button>
              
              <Button 
                className="h-fit bg-red-500 hover:bg-red-600 text-white border-red-600" 
                variant="outline"
                onClick={() => onEncerrar && onEncerrar(fornada.id)}
              >
                Encerrar
              </Button>
            </div>
        </div>
    );
}

export default DashboardFornadaData;