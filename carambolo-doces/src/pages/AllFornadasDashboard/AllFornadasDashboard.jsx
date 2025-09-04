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
import { useEffect, useState } from "react";
import { listFornadas, encerrarFornada } from "../../service/fornadaService";
import { useNavigate } from "react-router-dom";

function AllFornadasDashboard() {
    const [fornadas, setFornadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    useEffect(() => {
        carregarFornadas();
    }, [mesSelecionado, anoSelecionado]);

    const carregarFornadas = async () => {
        try {
            setLoading(true);
            const todasFornadas = await listFornadas();
            
            // Filtrar fornadas por mês/ano se necessário
            const fornadasFiltradas = todasFornadas.filter(fornada => {
                if (mesSelecionado && anoSelecionado) {
                    const dataInicio = new Date(fornada.dataInicio);
                    return dataInicio.getMonth() + 1 === mesSelecionado && 
                           dataInicio.getFullYear() === anoSelecionado;
                }
                return true;
            });
            
            setFornadas(fornadasFiltradas);
        } catch (error) {
            console.error('Erro ao carregar fornadas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConsultarFornada = (fornadaId) => {
        // Navegar para uma página de detalhes da fornada ou abrir modal
        navigate(`/fornada/${fornadaId}`);
    };

    const handleEncerrarFornada = async (fornadaId) => {
        try {
            const confirmacao = window.confirm(
                "Tem certeza que deseja encerrar esta fornada? Esta ação não pode ser desfeita."
            );

            if (!confirmacao) return;

            const sucesso = await encerrarFornada(fornadaId);
            
            if (sucesso) {
                alert('Fornada encerrada com sucesso!');
                carregarFornadas(); // Recarrega as fornadas para refletir o status atualizado
            } else {
                alert('Erro ao encerrar fornada!');
            }
        } catch (error) {
            console.error('Erro ao encerrar fornada:', error);
            alert('Erro ao encerrar fornada. Tente novamente.');
        }
    };

    const meses = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' }
    ];

    const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

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
                                <h1 className="text-gold text-[1.5rem]">KPIs das Fornadas</h1>

                                <div className="flex w-1/2 items-center justify-end gap-x-16">
                                    <Select 
                                        className="rounded-full" 
                                        placeholder="Mês" 
                                        width="25%" 
                                        rounded="full"
                                        value={mesSelecionado}
                                        onChange={(e) => setMesSelecionado(Number(e.target.value))}
                                        options={meses}
                                    />
                                    <Select 
                                        className="rounded-full" 
                                        placeholder="Ano" 
                                        width="25%" 
                                        rounded="full"
                                        value={anoSelecionado}
                                        onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                                        options={anos.map(ano => ({ value: ano, label: ano.toString() }))}
                                    />
                                </div>

                            </header>

                            <div className="flex flex-col p-5 gap-y-5">
                                {loading ? (
                                    <div className="text-center py-10">
                                        <p>Carregando fornadas...</p>
                                    </div>
                                ) : fornadas.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p>Nenhuma fornada encontrada para o período selecionado.</p>
                                    </div>
                                ) : (
                                    fornadas.map((fornada) => (
                                        <DashboardFornadaData 
                                            key={fornada.id} 
                                            fornada={fornada}
                                            onConsultar={handleConsultarFornada}
                                            onEncerrar={handleEncerrarFornada}
                                        />
                                    ))
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
