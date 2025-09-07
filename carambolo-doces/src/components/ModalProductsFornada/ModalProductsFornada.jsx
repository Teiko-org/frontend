import Button from "../Button";
import ModalBaseForm from "../ModalBaseForm";
import DataKPIFornada from "../DataKPIFornada/DataKPIFornada";
import { useEffect, useState } from "react";
import { getKPIFornadaMaisRecente } from "../../service/kpiService";
import { getLastFornada, getProdutosPorFornadaId } from "../../service/fornadaService";
import TableProductsThisFornada from "../TableProductsThisFornada/TableProductsThisFornada";

function ModalProductsFornada(props) {
    const [kpi, setKpi] = useState(null);
    const [fornada, setFornada] = useState(null);

    useEffect(() => {
        const load = async () => {
            const k = await getKPIFornadaMaisRecente();
            setKpi(k);
            if (k && k.fornadaId) {
                setFornada({ id: k.fornadaId, dataInicio: k.dataInicio, dataFim: k.dataFim });
            } else {
                const ultima = await getLastFornada();
                setFornada(ultima);
            }
        };
        load();
    }, []);

    const formatDate = (d) => {
        if (!d) return "";
        try {
            const [y, m, dd] = String(d).split('-');
            if (!y || !m || !dd) {
                const dt = new Date(d);
                return isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString('pt-BR');
            }
            return `${String(dd).padStart(2,'0')}/${String(m).padStart(2,'0')}/${y}`;
        } catch { return String(d); }
    };

    return (
        <ModalBaseForm title={`Produtos Fornada: ${formatDate(fornada?.dataInicio)} - ${formatDate(fornada?.dataFim)}`} onClose={props.onClose}>
            <div className="w-full flex flex-col items-center gap-4">
                <div className={`flex flex-col w-[415px] h-fit justify-center border-2 border-gold rounded-2xl bg-bgHome px-5 py-2`}>
                    <DataKPIFornada kpiData={kpi} />
                </div>
                {fornada?.id && (
                    <div className="w-full flex justify-center">
                        <TableProductsThisFornada idFornada={fornada.id} roundedTop={false} amountLeft={false} />
                    </div>
                )}
            </div>
        </ModalBaseForm>
    );
}

export default ModalProductsFornada;