import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import CustomDatePicker from "../../components/DatePicker-3";
import TableSelectProductsFornada from "../../components/TableSelectProductsFornada";
import Button from "../../components/Button";
import HeaderDashboard from "../../components/headerDashboard";
import { fornadaService } from "../../service/fornadaService";
import fornadaDaVezService from "../../service/fornadaDaVezService";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { insertNewFornada, updateFornada } from "../../service/fornadaService";

// Função para evitar problemas de fuso horário ao converter datas
const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [y, m, d] = String(dateStr).split("-").map(Number);
  if (!y || !m || !d) return new Date(dateStr);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
};
import KPILastFornada from "../../components/KPILastFornada";
import KPIThisMonthFornadas from "../../components/KPIThisMonthFornadas";
import { getFornadaAtiva, getProdutosFornadaComImagens, getProximaFornada, encerrarFornada } from "../../service/fornadaService";
import { FaRegEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import TableProductsThisFornada from "../../components/TableProductsThisFornada/TableProductsThisFornada";

function FornadaDashboard() {
  const navigate = useNavigate();

  const [fornada, setFornada] = useState({
    dataInicio: "",
    dataFim: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingFornada, setEditingFornada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDateChange = (field, value) => {
    if (isEditing) {
      setEditingFornada(prev => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setFornada((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Função para obter data mínima para o campo "Até" baseado na data de início
  const getMinDateFim = () => {
    if (!fornada.dataInicio) return null;
    return fornada.dataInicio; // Já está no formato YYYY-MM-DD
  };

  // Função para obter data mínima para o campo "Até" no modo de edição
  const getMinDateFimEdit = () => {
    if (!editingFornada?.dataInicio) return null;
    return editingFornada.dataInicio; // Já está no formato YYYY-MM-DD
  };

  const registerFornada = async () => {
    if (!fornada.dataInicio || !fornada.dataFim) {
      toast("Preencha as duas datas!", { type: "error" });
      return;
    }

    // As datas já estão no formato YYYY-MM-DD, não precisamos converter
    const dataInicio = new Date(fornada.dataInicio + 'T00:00:00');
    const dataFim = new Date(fornada.dataFim + 'T00:00:00');

    if (dataInicio > dataFim) {
      toast("A data de início deve ser menor que a data final!", {
        type: "error",
      });
      return;
    }

    const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts") || "[]");
    if (!selectedProducts.length) {
      toast("Selecione pelo menos um produto!", { type: "error" });
      return;
    }

    try {
      toast.info("Cadastrando fornada...");
      const response = await insertNewFornada(fornada);

      if (response && response.id) {
        await registerFornadaDaVez(response.id);
        // Limpar formulário após sucesso
        setFornada({ dataInicio: "", dataFim: "" });
        // Limpar produtos selecionados
        localStorage.removeItem("selectedProducts");
        // Recarregar dados para mostrar a nova fornada
        await carregarDadosFornada();
      } else {
        toast.error("Erro ao cadastrar fornada!");
      }
    } catch (error) {
      console.error("Erro ao cadastrar fornada:", error);
      toast.error("Erro ao cadastrar fornada! Tente novamente.");
    }
  };

  const handleEditFornada = () => {
    if (fornadaAtual) {
      setEditingFornada({
        ...fornadaAtual,
        dataInicio: fornadaAtual.dataInicio,
        dataFim: fornadaAtual.dataFim
      });
    } else if (fornadaProxima) {
      setEditingFornada({
        ...fornadaProxima,
        dataInicio: fornadaProxima.dataInicio,
        dataFim: fornadaProxima.dataFim
      });
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editingFornada || !editingFornada.dataInicio || !editingFornada.dataFim) {
      toast("Preencha as duas datas!", { type: "error" });
      return;
    }

    // As datas já estão no formato YYYY-MM-DD, não precisamos converter
    const dataInicio = new Date(editingFornada.dataInicio + 'T00:00:00');
    const dataFim = new Date(editingFornada.dataFim + 'T00:00:00');

    if (dataInicio > dataFim) {
      toast("A data de início deve ser menor que a data final!", {
        type: "error",
      });
      return;
    }

    try {
      toast.info("Salvando alterações...");
      const sucesso = await updateFornada(editingFornada.id, {
        dataInicio: editingFornada.dataInicio,
        dataFim: editingFornada.dataFim
      });

      if (sucesso) {
        // Verificar se há produtos selecionados para adicionar
        const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts") || "[]");
        if (selectedProducts.length > 0) {
          toast.info("Adicionando produtos à fornada...");
          await registerFornadaDaVez(editingFornada.id);
          // Limpar produtos selecionados após adicionar
          localStorage.removeItem("selectedProducts");
        }
        
        toast.success("Fornada atualizada com sucesso!");
        setIsEditing(false);
        setEditingFornada(null);
        await carregarDadosFornada();
      } else {
        toast.error("Erro ao atualizar fornada!");
      }
    } catch (error) {
      console.error("Erro ao atualizar fornada:", error);
      toast.error("Erro ao atualizar fornada! Tente novamente.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingFornada(null);
  };

  const notify = () => {
    toast("Fornada cadastrada com sucesso!", {
      type: "success",
    });
    // Não redireciona mais, permanece na tela
  };

  const registerFornadaDaVez = async (idFornada) => {
    try {
      const selectedProductsJson = JSON.parse(
        localStorage.getItem("selectedProducts") || "[]"
      );

      if (!selectedProductsJson.length) {
        toast.error("Nenhum produto selecionado!");
        return;
      }

      toast.info("Adicionando produtos à fornada...");

      const responses = await Promise.all(
        selectedProductsJson.map((produto) =>
          fornadaDaVezService({
            fornadaId: idFornada,
            produtoFornadaId: produto.id,
            quantidade: produto.quantidade,
          })
        )
      );

      if (responses.every(response => response)) {
        notify();
      } else {
        toast.error("Erro ao adicionar alguns produtos!");
      }
    } catch (error) {
      console.error("Erro ao registrar produtos da fornada:", error);
      toast.error("Erro ao adicionar produtos à fornada!");
    }
  };

  // Fornada já cadastrada:
  const [fornadaAtual, setFornadaAtual] = useState(null);
  const [fornadaProxima, setFornadaProxima] = useState(null);

  const carregarDadosFornada = async () => {
    try {
      // Buscar fornada atual
      try {
        const fornadaAtiva = await getFornadaAtiva();
        if (fornadaAtiva) {
          setFornadaAtual(fornadaAtiva);
        } else {
          setFornadaAtual(null);
        }
      } catch (error) {
        console.error("Erro ao buscar fornada ativa:", error);
        setFornadaAtual(null);
      }

      // Buscar próxima fornada
      try {
        const proximaFornada = await getProximaFornada();
        if (proximaFornada) {
          setFornadaProxima(proximaFornada);
        } else {
          setFornadaProxima(null);
        }
      } catch (error) {
        console.error("Erro ao buscar próxima fornada:", error);
        setFornadaProxima(null);
      }
    } catch (error) {
      console.error("Erro geral ao carregar dados da fornada:", error);
    }
  };

  useEffect(() => {
    carregarDadosFornada();
  }, []);

  const [fornadaData, setFornadaData] = useState(fornadaAtual);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!fornadaAtual) {
      const fetchFornadaAtiva = async () => {
        try {
          const fornadaAtiva = await getFornadaAtiva();
          if (fornadaAtiva && fornadaAtiva.dataFim) {
            setFornadaData(fornadaAtiva);
          }
        } catch (error) {
          console.error('Erro ao buscar fornada ativa:', error);
        }
      };
      fetchFornadaAtiva();
    } else {
      setFornadaData(fornadaAtual);
    }
  }, [fornadaAtual]);

  useEffect(() => {
    if (!fornadaData || !fornadaData.dataFim) {
      return;
    }

    const calculateTimeLeft = () => {
      let endDate;
      const dataFim = fornadaData.dataFim;

      if (dataFim.includes('T') || dataFim.includes(' ')) {
        endDate = new Date(dataFim);
      } else {
        endDate = new Date(dataFim + "T23:59:59");
      }

      if (isNaN(endDate.getTime())) {
        console.error('❌ Data inválida para timer:', dataFim);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      
        setFornadaAtual(null);
        setFornadaData(null);
      }
    };

    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [fornadaData]);

  function isFornadaAtiva(fornada) {
    const now = new Date();
    const inicio = new Date(fornada.dataInicio);
    const fim = new Date(fornada.dataFim);
    return now >= inicio && now <= fim;
  }

  const handleEncerrarFornada = async () => {
    try {
      const fornadaId = fornadaAtual?.id || fornadaProxima?.id;
      if (!fornadaId) {
        toast.error("Nenhuma fornada encontrada para encerrar!");
        return;
      }

      const confirmacao = window.confirm(
        "Tem certeza que deseja encerrar esta fornada? Esta ação não pode ser desfeita."
      );

      if (!confirmacao) return;

      toast.info("Encerrando fornada...");
      const sucesso = await encerrarFornada(fornadaId);
      
      if (sucesso) {
        toast.success("Fornada encerrada com sucesso!");
        // Recarregar os dados da fornada
        await carregarDadosFornada();
      } else {
        toast.error("Erro ao encerrar fornada!");
      }
    } catch (error) {
      console.error("Erro ao encerrar fornada:", error);
      toast.error("Erro ao encerrar fornada! Tente novamente.");
    }
  };

  // Determinar o estado atual da tela
  const hasActiveFornada = fornadaAtual && parseLocalDate(fornadaAtual.dataFim) > new Date();
  const hasScheduledFornada = fornadaProxima && parseLocalDate(fornadaProxima.dataInicio) > new Date();
  const hasNoFornada = !hasActiveFornada && !hasScheduledFornada;

  // Função auxiliar para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      // Evitar problemas de fuso horário - parsear localmente
      const [year, month, day] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString;
    }
  };

  // Função para verificar se estamos dentro do intervalo da fornada
  const isWithinFornadaInterval = (fornadaData) => {
    if (!fornadaData || !fornadaData.dataInicio || !fornadaData.dataFim) return false;
    
    const now = new Date();
    const dataInicio = parseLocalDate(fornadaData.dataInicio);
    const dataFim = parseLocalDate(fornadaData.dataFim);
    
    // Ajustar para início do dia (00:00:00) e fim do dia (23:59:59)
    dataInicio.setHours(0, 0, 0, 0);
    dataFim.setHours(23, 59, 59, 999);
    
    return now >= dataInicio && now <= dataFim;
  };

  // Função para renderizar o conteúdo do card central baseado no estado
  const renderCardContent = () => {
    if (isEditing) {
      return (
        <>
          <h3 className="font-bold text-blue">Editar Datas da Fornada</h3>
          <div className="flex justify-center gap-10">
            <CustomDatePicker
              label="De:"
              value={editingFornada?.dataInicio || ""}
              onChange={(date) => handleDateChange("dataInicio", date)}
              placeholder="Data Início"
            />
            <CustomDatePicker
              label="Até:"
              value={editingFornada?.dataFim || ""}
              onChange={(date) => handleDateChange("dataFim", date)}
              placeholder="Data Fim"
              min={getMinDateFimEdit()}
            />
          </div>
        </>
      );
    }

    if (hasNoFornada) {
      return (
        <>
          <h3 className="font-bold text-blue">Iniciar Nova Fornada</h3>
          <div className="flex justify-center gap-10">
            <CustomDatePicker
              label="De:"
              value={fornada.dataInicio}
              onChange={(date) => handleDateChange("dataInicio", date)}
              placeholder="Data Início"
            />
            <CustomDatePicker
              label="Até:"
              value={fornada.dataFim}
              onChange={(date) => handleDateChange("dataFim", date)}
              placeholder="Data Fim"
              min={getMinDateFim()}
            />
          </div>
        </>
      );
    }

    if (hasActiveFornada && isWithinFornadaInterval(fornadaAtual)) {
      // Fornada ativa e estamos dentro do intervalo - mostrar timer
      return (
        <>
          <h3 className="font-bold text-blue">Tempo Restante da Fornada Atual</h3>
          <div className="text-center">
            <span className="text-lg">
              {String(timeLeft.days).padStart(2, '0')} Dias {String(timeLeft.hours).padStart(2, '0')} Horas {String(timeLeft.minutes).padStart(2, '0')} Minutos {String(timeLeft.seconds).padStart(2, '0')} Segundos
            </span>
          </div>
        </>
      );
    }


    if (hasActiveFornada || hasScheduledFornada) {
      // Fornada programada ou ativa mas fora do intervalo - mostrar datas
      const fornadaToShow = fornadaAtual || fornadaProxima;
      return (
        <>
          <h3 className="font-bold text-blue">Fornada Programada</h3>
          <div className="text-center">
            <span className="text-lg">
              De: {formatDate(fornadaToShow.dataInicio)} 
              <br />
              Até: {formatDate(fornadaToShow.dataFim)}
            </span>
          </div>
        </>
      );
    }

    return null;
  };

  // Função para renderizar a tabela de produtos baseada no estado
  const renderProductTable = () => {
    if (isEditing) {
      // Modo de edição - mostrar seleção de produtos para adicionar
      return (
        <div className="w-full flex justify-center">
          <TableSelectProductsFornada />
        </div>
      );
    }

    if (hasNoFornada) {
      // Sem fornada - mostrar seleção de produtos para nova fornada
      return (
        <div className="w-full flex justify-center">
          <TableSelectProductsFornada />
        </div>
      );
    }

    // Com fornada - mostrar produtos da fornada atual com a mesma estilização
    return (
      <div className="w-full">
        <div className="w-full flex justify-center border-2 border-gold rounded-2xl bg-bgHome">
          <div className="w-full">
            <header className="flex flex-row justify-between rounded-t-2xl px-6 py-4 items-center bg-gradient-blue h-[3.6875rem] w-full flex-shrink-0">
              <h1 className="text-gold text-[1.5rem]">Produtos da Fornada</h1>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Procurar produto"
                  className="px-4 py-2 border border-gold rounded-lg focus:outline-none focus:border-blue transition-all duration-300 ease-in-out focus:scale-105 focus:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="w-6 h-6 text-gold opacity-50">
                  🔍
                </div>
              </div>
            </header>
            <div className="p-6">
              <TableProductsThisFornada 
                idFornada={fornadaAtual?.id || fornadaProxima?.id} 
                roundedTop={false} 
                amountLeft={true}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-bgNativeHome">
      <BarraLateralDashboard />

      <div className="w-full min-h-screen pl-56">
        <header className="w-full">
          <HeaderDashboard title={"Fornada"} />
        </header>

        <div className="flex flex-col justify-evenly items-center min-h-[calc(100vh-80px)]">
          {/* Título principal - muda baseado no modo */}
          <div className="pb-5 font-bold text-blue transition-all duration-300 ease-in-out">
            {isEditing ? (
              <h1 className="font-bold text-blue transition-all duration-300 ease-in-out">Editar Fornada</h1>
            ) : hasNoFornada ? (
              <h1 className="font-bold text-blue transition-all duration-300 ease-in-out">Não há nenhuma fornada acontecendo no momento</h1>
            ) : hasActiveFornada ? (
              <h1 className="font-bold text-blue transition-all duration-300 ease-in-out">Já há uma Fornada acontecendo no momento</h1>
            ) : hasScheduledFornada ? (
              <h1 className="font-bold text-blue transition-all duration-300 ease-in-out">Já há uma Fornada cadastrada no momento</h1>
            ) : null}
          </div>

          <div className="flex flex-row justify-evenly items-center gap-10">
            <KPILastFornada />
            
            {/* Card central - muda baseado no estado e modo */}
            <div className="flex flex-col justify-center items-center w-[470px] h-[170px] border-2 border-gold rounded-2xl bg-bgHome gap-5 p-10 transition-all duration-500 ease-in-out">
              <div className="transition-all duration-300 ease-in-out">
                {renderCardContent()}
              </div>
            </div>

            <KPIThisMonthFornadas />
          </div>

          <div className="flex flex-col w-full items-center gap-5 pt-5">
            {/* Tabela de produtos baseada no estado e modo */}
            <div className="transition-all duration-500 ease-in-out w-full">
              {renderProductTable()}
            </div>

            {/* Botões de ação baseados no estado e modo */}
            <div className="transition-all duration-300 ease-in-out">
            {isEditing ? (
              // Modo de edição - botões de salvar e cancelar
              <div className="flex gap-4 mb-5">
                <button
                  className="flex items-center bg-gradient-to-l from-gold to-darkGold text-blue font-bold py-3 px-6 rounded-lg shadow-md border-2 border-gold focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg"
                  onClick={handleSaveEdit}
                >
                  <FaSave className="mr-2" />
                  SALVAR ALTERAÇÕES
                </button>
                
                <button
                  className="flex items-center bg-gradient-to-l from-gold to-darkGold text-blue font-bold py-3 px-6 rounded-lg shadow-md border-2 border-gold focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg"
                  onClick={handleCancelEdit}
                >
                  <FaTimes className="mr-2" />
                  CANCELAR
                </button>
              </div>
            ) : hasNoFornada ? (
              // Estado 1: Botão para cadastrar nova fornada
              <button
                className="mb-5 flex items-center bg-gradient-to-l from-gold to-darkGold text-lg text-blue border-gold font-bold py-1 px-4 rounded-full shadow-md border-2 focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg"
                onClick={registerFornada}
              >
                CADASTRAR FORNADA <FaPlus className="inline ml-2" />
              </button>
            ) : (
              // Estados 2 e 3: Botões para editar e encerrar
              <div className="flex gap-4 mb-5">
                              <button
                className="flex items-center bg-gradient-to-l from-gold to-darkGold text-lg text-blue border-gold font-bold py-1 px-4 rounded-full shadow-md border-2 focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg"
                onClick={handleEditFornada}
              >
                EDITAR FORNADA <FaRegEdit className="inline ml-2" />
              </button>

                <button
                  className="flex items-center bg-gradient-to-l from-blue to-darkBlue text-lg text-white border-blue font-bold py-1 px-4 rounded-full shadow-md border-2 focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg"
                  onClick={handleEncerrarFornada}
                >
                  ENCERRAR FORNADA
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default FornadaDashboard;
