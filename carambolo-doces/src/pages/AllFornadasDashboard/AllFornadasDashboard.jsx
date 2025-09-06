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
import { listFornadas, encerrarFornada, getMesesAnosFornadas, getFornadasMesAno } from "../../service/fornadaService";
import { useNavigate } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";

function AllFornadasDashboard() {
    const [fornadas, setFornadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    // Estados para a nova implementação
    const [dados, setDados] = useState([]);
    const [meses, setMeses] = useState([]);
    const [anos, setAnos] = useState([]);
    // removido estado duplicado; usaremos apenas `fornadas`

    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    useEffect(() => {
        carregarFornadas();
        getMesesAnos();
    }, [mesSelecionado, anoSelecionado]);

    const carregarFornadas = async () => {
        try {
            setLoading(true);
            // Caso ANO e MÊS selecionados: busca diretamente filtrado no back
            if (anoSelecionado && mesSelecionado) {
                const filtradas = await getFornadasMesAno(mesSelecionado, anoSelecionado);
                setFornadas(Array.isArray(filtradas) ? filtradas : []);
                return;
            }

            // Carrega todas e filtra no cliente para os casos parciais
            const todasFornadas = await listFornadas();
            let resultado = Array.isArray(todasFornadas) ? todasFornadas : [];

            if (anoSelecionado && !mesSelecionado) {
                resultado = resultado.filter(f => new Date(f.dataInicio).getFullYear() === Number(anoSelecionado));
            } else if (!anoSelecionado && mesSelecionado) {
                resultado = resultado.filter(f => (new Date(f.dataInicio).getMonth() + 1) === Number(mesSelecionado));
            }

            setFornadas(resultado);
        } catch (error) {
            console.error('Erro ao carregar fornadas:', error);
            setFornadas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleConsultarFornada = (fornadaId) => {
        setFornadaSelecionada((prev) => (prev === fornadaId ? null : fornadaId));
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

    const getMesesAnos = async () => {
        try {
            const data = await getMesesAnosFornadas();
            setDados(data);
            // anos sempre independentes do mês
            const anosUnicos = [...new Set((data || []).map(item => item.ano))].sort((a,b)=>b-a);
            setAnos(anosUnicos.map(ano => ({ label: ano, value: ano })));
            // se já há ano selecionado, filtra meses por esse ano; senão lista todos
            const mesesBase = (anoSelecionado ? data.filter(i => i.ano === anoSelecionado) : data) || [];
            const mesesUnicos = [...new Set(mesesBase.map(item => item.mes))].sort((a,b)=>a-b);
            setMeses(mesesUnicos.map(mes => ({ label: nomesMeses[mes - 1], value: mes })));
        } catch (error) {
            console.error(error);
            setMeses([]);
            setAnos([]);
        }
    };

    useEffect(() => {
        // Quando o ano muda, recalcula os meses disponíveis para aquele ano
        const mesesDisponiveis = (dados || [])
            .filter(item => anoSelecionado ? item.ano === anoSelecionado : true)
            .map(item => item.mes);
        const mesesUnicos = [...new Set(mesesDisponiveis)].sort((a,b)=>a-b);
        setMeses(mesesUnicos.map(mes => ({ label: nomesMeses[mes - 1], value: mes })));
        if (mesSelecionado && !mesesUnicos.includes(mesSelecionado)) setMesSelecionado(null);
    }, [anoSelecionado, dados]);

    // Anos não dependem do mês: sempre listar todos disponíveis
    useEffect(() => {
        const anosUnicos = [...new Set((dados || []).map(item => item.ano))].sort((a,b)=>b-a);
        setAnos(anosUnicos.map(ano => ({ label: ano, value: ano })));
    }, [dados]);

    // removido efeito duplicado; `carregarFornadas` já popula `fornadas`

    const [fornadaSelecionada, setFornadaSelecionada] = useState(null);

    return (
        <div className="flex h-full bg-bgNativeHome">
            <BarraLateralDashboard />

            <div className="w-full h-full pl-56">
                <header className="w-full">
                    <div className="flex items-center justify-between pr-8">
                        <HeaderDashboard 
                          title={"Fornada"}
                          rightContent={
                            <button
                              onClick={() => navigate(-1)}
                              className="bg-gradient-to-l from-gold to-darkGold text-blue font-bold px-4 py-1 rounded-full border-2 border-gold shadow hover:shadow-md"
                            >
                              Sair
                            </button>
                          }
                        />
                    </div>
                </header>

                <div className="flex flex-col justify-evenly items-center">
                    <div className="flex flex-row justify-evenly items-center gap-10">

                        <KPIThisMonthFornadas hideConsultar />

                    </div>
                    <div className="flex flex-col w-full items-center gap-5 pt-5">

                        <div className={`flex flex-col w-full h-fit justify-center border-2 border-gold rounded-2xl bg-bgHome`}>
                            <header className="flex flex-row justify-between rounded-t-2xl px-20 items-center bg-gradient-blue h-[3.6875rem] w-full flex-shrink-0">
                                <h1 className="text-gold text-[1.5rem]">KPIs das Fornadas</h1>

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
                                {loading ? (
                                    <div className="text-center py-10">
                                        <p>Carregando fornadas...</p>
                                    </div>
                                ) : fornadas.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p>Nenhuma fornada encontrada para o período selecionado.</p>
                                    </div>
                                ) : (
                                    <>
                                      {fornadas.map((fornada) => (
                                        <div key={fornada.id} className="w-full">
                                          <DashboardFornadaData 
                                            fornada={fornada}
                                            onConsultar={handleConsultarFornada}
                                          />
                                          {fornadaSelecionada === fornada.id && (
                                            <div className="mt-2 px-1">
                                              <TableProductsThisFornada 
                                                idFornada={fornada.id} 
                                                roundedTop={false} 
                                                amountLeft={false}
                                                compact
                                              />
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </>
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
