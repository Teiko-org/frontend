import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import CustomDatePicker from "../../components/DatePicker-3";
import TableSelectProductsFornada from "../../components/TableSelectProductsFornada";
import Button from "../../components/Button";
import HeaderDashboard from "../../components/headerDashboard";
import "react-toastify/dist/ReactToastify.css";
import KPILastFornada from "../../components/KPILastFornada";
import KPIThisMonthFornadas from "../../components/KPIThisMonthFornadas";
import DashboardFornadaData from "../../components/DashboardFornadaData/DashboardFornadaData";
import Select from "../../components/Select";
import TableProductsThisFornada from "../../components/TableProductsThisFornada/TableProductsThisFornada";
import { getMesesAnosFornadas, getFornadasMesAno } from "../../service/fornadaService";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

function AllFornadasDashboard() {
    const [dados, setDados] = useState([]);
    const [meses, setMeses] = useState([]);
    const [anos, setAnos] = useState([]);
    const [anoSelecionado, setAnoSelecionado] = useState(null);
    const [mesSelecionado, setMesSelecionado] = useState(null);
    const [fornadasMesAno, setFornadasMesAno] = useState([]);

    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const getMesesAnos = async () => {
        try {
            const data = await getMesesAnosFornadas();
            setDados(data);

            const anosUnicos = [...new Set(data.map(item => item.ano))];
            const mesesUnicos = [...new Set(data.map(item => item.mes))];

            setAnos(anosUnicos.map(ano => ({ label: ano, value: ano })));
            setMeses(mesesUnicos.map(mes => ({
                label: nomesMeses[mes - 1],
                value: mes
            })));
        } catch (error) {
            console.error(error);
            setMeses([]);
            setAnos([]);
        }
    };

    useEffect(() => {
        getMesesAnos();
    }, []);

    useEffect(() => {
        if (anoSelecionado) {
            const mesesDisponiveis = dados
                .filter(item => item.ano === anoSelecionado)
                .map(item => item.mes);
            const mesesUnicos = [...new Set(mesesDisponiveis)];
            setMeses(mesesUnicos.map(mes => ({
                label: nomesMeses[mes - 1],
                value: mes
            })));

            if (!mesesUnicos.includes(mesSelecionado)) setMesSelecionado(null);

        } else {
            const mesesUnicos = [...new Set(dados.map(item => item.mes))];
            setMeses(mesesUnicos.map(mes => ({
                label: nomesMeses[mes - 1],
                value: mes
            })));
        }
    }, [anoSelecionado, dados]);

    useEffect(() => {
        if (mesSelecionado) {
            const anosDisponiveis = dados
                .filter(item => item.mes === mesSelecionado)
                .map(item => item.ano);
            const anosUnicos = [...new Set(anosDisponiveis)];
            setAnos(anosUnicos.map(ano => ({ label: ano, value: ano })));
            
            if (!anosUnicos.includes(anoSelecionado)) setAnoSelecionado(null);
        } else {
            
            const anosUnicos = [...new Set(dados.map(item => item.ano))];
            setAnos(anosUnicos.map(ano => ({ label: ano, value: ano })));
        }
    }, [mesSelecionado, dados]);

    useEffect(() => {
        if (mesSelecionado && anoSelecionado) {
            getFornadasMesAno(mesSelecionado, anoSelecionado)
                .then(res => {
                    console.log(" getFornadasMesAno:", res);
                    setFornadasMesAno(Array.isArray(res) ? res : []);
                })
                .catch(err => {
                    console.error(err);
                    setFornadasMesAno([]);
                });
        } else {
            setFornadasMesAno([]);
        }
    }, [mesSelecionado, anoSelecionado]);

    return (
        <div className="flex h-full bg-bgNativeHome">
            <BarraLateralDashboard />

            <div className="w-full h-full pl-56">
                <header className="w-full">
                    <HeaderDashboard title={"Fornada"} />
                </header>

                <div className="flex flex-col justify-evenly items-center">

                    <TableProductsThisFornada idFornada={1} roundedTop={false} amountLeft={false} />
                    <div className="flex flex-row justify-evenly items-center gap-10">

                        <KPIThisMonthFornadas />

                    </div>
                    <div className="flex flex-col w-full items-center gap-5 pt-5">

                        <div className={`flex flex-col w-full h-fit justify-center border-2 border-gold rounded-2xl bg-bgHome`}>
                            <header className="flex flex-row justify-between rounded-t-2xl px-20 items-center bg-gradient-blue h-[3.6875rem] w-full flex-shrink-0">
                                <h1 className="text-gold text-[1.5rem]">Selecionar Produtos</h1>

                                <div className="flex w-1/2 items-center justify-end gap-x-16">

                                    <div className="relative w-40">
                                        <select
                                            className="rounded-full border-2 border-gold px-4 py-2 pr-8 w-full appearance-none"
                                            value={anoSelecionado || ""}
                                            onChange={e => setAnoSelecionado(e.target.value ? Number(e.target.value) : null)}
                                        >
                                            <option value="">Ano</option>
                                            {anos.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gold">
                                            <IoChevronDown />
                                        </div>
                                    </div>

                                    <div className="relative w-40">
                                        <select
                                            className="rounded-full border-2 border-gold px-4 py-2 pr-8 w-full appearance-none"
                                            value={mesSelecionado || ""}
                                            onChange={e => setMesSelecionado(e.target.value ? Number(e.target.value) : null)}
                                        >
                                            <option value="">Mês</option>
                                            {meses.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gold">
                                            <IoChevronDown />
                                        </div>
                                    </div>
                                </div>

                            </header>

                            <div className="flex flex-col p-5 gap-y-5">
                                {fornadasMesAno.length === 0 ? (
                                    <p className="text-center text-gray-500">Nenhuma fornada encontrada.</p>
                                ) : (
                                    
                                    [...new Set(fornadasMesAno.map(item => item.fornada))].map(fornadaId => {
                                        
                                        const produtosDaFornada = fornadasMesAno.filter(item => item.fornada === fornadaId);
                                        
                                        return (
                                            <DashboardFornadaData
                                                key={fornadaId}
                                                fornadaId={fornadaId}
                                                produtos={produtosDaFornada}
                                            />
                                        );
                                    })
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AllFornadasDashboard;
