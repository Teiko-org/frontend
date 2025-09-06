import { useState, useEffect } from 'react';

function DataKPIFornada({ kpiData }) {
    const [data, setData] = useState({
        quantidadeVendida: 0,
        quantidadeDisponivel: 0,
        totalVendido: 0,
        totalDisponivel: 0,
        valorPerdido: 0
    });

    useEffect(() => {
        if (kpiData) {
            setData({
                quantidadeVendida: kpiData.quantidadeVendida || 0,
                quantidadeDisponivel: kpiData.quantidadeDisponivel || 0,
                totalVendido: kpiData.totalVendido || 0,
                totalDisponivel: kpiData.totalDisponivel || 0,
                valorPerdido: kpiData.valorPerdido || 0
            });
        }
    }, [kpiData]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <>
            <div className="flex flex-col gap-y-1 items-end justify-center">
                <span className="w-full flex justify-between">Total Vendidos:
                    <span>
                        <span className="text-green">{data.quantidadeVendida}</span> / <span className="text-green">{data.quantidadeDisponivel}</span>
                    </span>
                </span>

                <span className="w-full flex justify-between">Valor Vendido:
                    <span className="text-green">{formatCurrency(data.totalVendido)}</span>
                </span>

                <span className="w-full flex justify-between">Valor Perdido:
                    <span className="text-red">{formatCurrency(data.valorPerdido)}</span>
                </span>
            </div>
        </>
    );
}

export default DataKPIFornada;