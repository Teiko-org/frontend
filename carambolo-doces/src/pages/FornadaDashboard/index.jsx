import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import CustomDatePicker from "../../components/DatePicker-3";
import TableSelectProductsFornada from "../../components/TableSelectProductsFornada";
import Button from "../../components/Button";
import HeaderDashboard from "../../components/headerDashboard";
import { fornadaService } from "../../service/fornadaService";
import fornadaDaVezService from "../../service/fornadaDaVezService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { insertNewFornada, updateFornada } from "../../service/fornadaService";
import { validateAndCleanAuth } from "../../service/userService";
import { toast } from "../../utils/toast";

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [y, m, d] = String(dateStr).split("-").map(Number);
  if (!y || !m || !d) return new Date(dateStr);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
};
import KPILastFornada from "../../components/KPILastFornada";
import KPIThisMonthFornadas from "../../components/KPIThisMonthFornadas";
import { listFornadas, encerrarFornada, getProdutosPorFornadaId, getFornadaAtiva } from "../../service/fornadaService";
import { atualizarFornadaDaVez, excluirFornadaDaVez } from "../../service/fornadaDaVezService";
import { FaRegEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import ModalConfirmarEdicao from "../../components/ModalConfirmarEdicao";
import { useRef } from "react";
import TableProductsThisFornada from "../../components/TableProductsThisFornada/TableProductsThisFornada";

function FornadaDashboard() {
  const navigate = useNavigate();

  const [fornada, setFornada] = useState({
    dataInicio: "",
    dataFim: "",
  });

  const [kpiRefreshKey, setKpiRefreshKey] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editingFornada, setEditingFornada] = useState(null);
  const [initialEditingFornada, setInitialEditingFornada] = useState(null);
  const [initialSelectedProducts, setInitialSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  const getMinDateFim = () => {
    if (!fornada.dataInicio) return null;
    return fornada.dataInicio; 
  };

  const getMinDateFimEdit = () => {
    if (!editingFornada?.dataInicio) return null;
    return editingFornada.dataInicio; 
  };

  const registerFornada = async () => {
    if (!fornada.dataInicio || !fornada.dataFim) {
      toast.error('Preencha as duas datas!');
      return;
    }

    const dataInicio = new Date(fornada.dataInicio + 'T00:00:00');
    const dataFim = new Date(fornada.dataFim + 'T00:00:00');

    if (dataInicio > dataFim) {
      toast.error('A data de início deve ser menor que a data final!');
      return;
    }

    const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts") || "[]");
    if (!selectedProducts.length) {
      toast.error('Selecione pelo menos um produto!');
      return;
    }

    try {
      toast.info('Cadastrando fornada...');
      const response = await insertNewFornada(fornada);

      if (response && response.id) {
        await registerFornadaDaVez(response.id);
        setFornada({ dataInicio: "", dataFim: "" });
        localStorage.removeItem("selectedProducts");
        await carregarDadosFornada();
      } else {
        toast.error('Erro ao cadastrar fornada!');
      }
    } catch (error) {
      console.error("Erro ao cadastrar fornada:", error);
      toast.error('Erro ao cadastrar fornada! Tente novamente.');
    }
  };

  const handleEditFornada = async () => {
    const fornadaParaEditar = fornadaAtual || fornadaProxima;
    if (!fornadaParaEditar) return;

    try {
      const produtosFornada = await getProdutosPorFornadaId(fornadaParaEditar.id);
      const produtosSelecionados = (produtosFornada || [])
        .filter(produto => produto.id && produto.fornadaDaVezId && (produto.quantidade || produto.quantidadeTotal || 0) > 0)
        .map(produto => ({
          id: produto.id,
          quantidade: produto.quantidadeTotal || produto.quantidade || 1
        }));
      localStorage.setItem("selectedProducts", JSON.stringify(produtosSelecionados));

      const fornadaInicial = {
        ...fornadaParaEditar,
        dataInicio: fornadaParaEditar.dataInicio,
        dataFim: fornadaParaEditar.dataFim
      };
      
      setEditingFornada(fornadaInicial);
      setInitialEditingFornada(JSON.parse(JSON.stringify(fornadaInicial)));
      setInitialSelectedProducts(JSON.parse(JSON.stringify(produtosSelecionados)));
      setIsEditing(true);
      
      // Disparar evento para forçar recarregamento da lista de produtos
      setTimeout(() => {
        console.log('📢 Disparando evento fornadaEditModeActivated...');
        window.dispatchEvent(new CustomEvent('fornadaEditModeActivated'));
      }, 100);
    } catch (error) {
      console.error("Erro ao carregar produtos da fornada:", error);
      toast.error('Erro ao carregar produtos da fornada. Tente novamente.');
    }
  };

  const handleSaveEdit = async () => {
    if (!validateAndCleanAuth()) {
      toast.error('Você precisa estar logado para atualizar uma fornada!');
      navigate('/login');
      return;
    }

    if (!editingFornada || !editingFornada.dataInicio || !editingFornada.dataFim) {
      toast.error('Preencha as duas datas!');
      return;
    }

    const dataInicio = new Date(editingFornada.dataInicio + 'T00:00:00');
    const dataFim = new Date(editingFornada.dataFim + 'T00:00:00');

    if (dataInicio > dataFim) {
      toast.error('A data de início deve ser menor que a data final!');
      return;
    }

    try {
      toast.info('Salvando alterações...');
      const sucesso = await updateFornada(editingFornada.id, {
        dataInicio: editingFornada.dataInicio,
        dataFim: editingFornada.dataFim
      });

      if (sucesso) {
        toast.info('Sincronizando produtos da fornada...');
        await sincronizarProdutosFornada(editingFornada.id);
        localStorage.removeItem("selectedProducts");
        
        toast.success('Fornada atualizada com sucesso!');
        setIsEditing(false);
        setEditingFornada(null);
        await carregarDadosFornada();
      } else {
        toast.error('Erro ao atualizar fornada!');
      }
    } catch (error) {
      console.error("Erro ao atualizar fornada:", error);
      toast.error('Erro ao atualizar fornada! Tente novamente.');
    }
  };

  const hasUnsavedChanges = () => {
    if (!editingFornada || !initialEditingFornada) return false;
    
    const datesChanged = editingFornada.dataInicio !== initialEditingFornada.dataInicio ||
                         editingFornada.dataFim !== initialEditingFornada.dataFim;
    
    const currentProducts = JSON.parse(localStorage.getItem("selectedProducts") || "[]");
    const productsChanged = JSON.stringify(currentProducts.sort((a, b) => a.id - b.id)) !== 
                           JSON.stringify(initialSelectedProducts.sort((a, b) => a.id - b.id));
    
    return datesChanged || productsChanged;
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges()) {
      setShowCancelConfirm(true);
    } else {
      confirmCancelEdit();
    }
  };

  const confirmCancelEdit = () => {
    setIsEditing(false);
    setEditingFornada(null);
    setInitialEditingFornada(null);
    setInitialSelectedProducts([]);
    setShowCancelConfirm(false);
    localStorage.setItem("selectedProducts", JSON.stringify(initialSelectedProducts));
  };

  const notify = () => {
    toast.success('Fornada cadastrada com sucesso!');
  };

  const sincronizarProdutosFornada = async (idFornada) => {
    try {
      const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts") || "[]");
      const produtosAtuais = await getProdutosPorFornadaId(idFornada);
      
      const produtosAtuaisMap = new Map();
      produtosAtuais.forEach(produto => {
        if (produto.fornadaDaVezId && produto.id) {
          produtosAtuaisMap.set(produto.id, {
            fornadaDaVezId: produto.fornadaDaVezId,
            quantidade: produto.quantidade
          });
        }
      });

      const produtosSelecionadosMap = new Map();
      selectedProducts.forEach(produto => {
        produtosSelecionadosMap.set(produto.id, produto.quantidade);
      });

      const operacoes = [];

      for (const [produtoId, quantidade] of produtosSelecionadosMap.entries()) {
        const produtoAtual = produtosAtuaisMap.get(produtoId);
        
        if (produtoAtual) {
          if (quantidade !== produtoAtual.quantidade) {
            if (quantidade > 0) {
              operacoes.push(atualizarFornadaDaVez(produtoAtual.fornadaDaVezId, quantidade));
            } else {
              operacoes.push(excluirFornadaDaVez(produtoAtual.fornadaDaVezId));
            }
          }
        } else {
          if (quantidade > 0) {
            operacoes.push(fornadaDaVezService({
              fornadaId: idFornada,
              produtoFornadaId: produtoId,
              quantidade: quantidade,
            }));
          }
        }
      }

      for (const [produtoId, produtoAtual] of produtosAtuaisMap.entries()) {
        if (!produtosSelecionadosMap.has(produtoId)) {
          operacoes.push(excluirFornadaDaVez(produtoAtual.fornadaDaVezId));
        }
      }

      if (operacoes.length > 0) {
        await Promise.all(operacoes);
      }
    } catch (error) {
      console.error("Erro ao sincronizar produtos da fornada:", error);
      throw error;
    }
  };

  const registerFornadaDaVez = async (idFornada) => {
    try {
      const selectedProductsJson = JSON.parse(
        localStorage.getItem("selectedProducts") || "[]"
      );

      // Filtrar apenas produtos com quantidade > 0 e com ID válido
      const produtosValidos = selectedProductsJson.filter(
        (produto) => produto.id && produto.quantidade > 0
      );

      if (!produtosValidos.length) {
        toast.error('Nenhum produto selecionado!');
        return;
      }

      toast.info('Adicionando produtos à fornada...');

      const responses = await Promise.all(
        produtosValidos.map((produto) =>
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
        toast.error('Erro ao adicionar alguns produtos!');
      }
    } catch (error) {
      console.error("Erro ao registrar produtos da fornada:", error);
      toast.error('Erro ao adicionar produtos à fornada!');
    }
  };

  const [fornadaAtual, setFornadaAtual] = useState(null);
  const [fornadaProxima, setFornadaProxima] = useState(null);

  const carregarDadosFornada = async () => {
    try {
      const fornadas = await listFornadas();
      const hoje = new Date(); hoje.setHours(0, 0, 0, 0);

      const ativas = (fornadas || []).filter(f => (f.isAtivo ?? f.ativo) === true);

      let atual = null;
      let proxima = null;

      if (ativas.length > 0) {
        const ordenadas = [...ativas].sort(
          (a, b) => new Date(a.dataInicio) - new Date(b.dataInicio)
        );

        for (const f of ordenadas) {
          const ini = parseLocalDate(f.dataInicio); ini.setHours(0, 0, 0, 0);
          const fim = parseLocalDate(f.dataFim); fim.setHours(23, 59, 59, 999);

          if (!atual && hoje >= ini && hoje <= fim) {
            atual = f;
          } else if (!proxima && ini > hoje) {
            proxima = f;
          }
        }
      }

      setFornadaAtual(atual);
      setFornadaProxima(proxima);
      setFornadaData(atual || null);

      // força KPIs a recarregarem seus dados da API
      setKpiRefreshKey((v) => v + 1);
    } catch (error) {
      console.error("Erro geral ao carregar dados da fornada:", error);
      setFornadaAtual(null);
      setFornadaProxima(null);
      setFornadaData(null);
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
    setFornadaData(fornadaAtual || null);
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingFornadaIdRef = useRef(null);
  const handleEncerrarFornada = async () => {
    if (!validateAndCleanAuth()) {
      toast.error('Você precisa estar logado para encerrar uma fornada!');
      navigate('/login');
      return;
    }

    try {
      const fornadaId = fornadaAtual?.id || fornadaProxima?.id;
      if (!fornadaId) {
        toast.error('Nenhuma fornada encontrada para encerrar!');
        return;
      }

      pendingFornadaIdRef.current = fornadaId;
      setConfirmOpen(true);
    } catch (error) {
      console.error("Erro ao encerrar fornada:", error);
      toast.error('Erro ao encerrar fornada! Tente novamente.');
    }
  };

  const confirmEncerrar = async () => {
    try {
      if (!pendingFornadaIdRef.current) { setConfirmOpen(false); return; }
      toast.info('Encerrando fornada...');
      const sucesso = await encerrarFornada(pendingFornadaIdRef.current);
      console.log('[ENCERRAR][FRONT] id=', pendingFornadaIdRef.current, ' sucesso=', sucesso);
      
      if (sucesso) {
        toast.success('Fornada encerrada com sucesso!');

        // Limpa seleção de produtos da fornada encerrada
        localStorage.removeItem("selectedProducts");

        // Garante que o estado local reflita o encerramento imediatamente
        setFornadaAtual(null);
        setFornadaProxima(null);
        setFornadaData(null);

        // As KPIs se baseiam em chamadas próprias à API e usam essa chave para refetch
        setKpiRefreshKey((v) => v + 1);
      } else {
        toast.error('Erro ao encerrar fornada!');
      }
    } catch (error) {
      console.error("[ENCERRAR][FRONT] Erro ao encerrar fornada:", error);
      toast.error('Erro ao encerrar fornada! Tente novamente.');
    } finally {
      setConfirmOpen(false);
      pendingFornadaIdRef.current = null;
    }
  };

  const nowDay = new Date(); nowDay.setHours(0,0,0,0);
  const hasActiveFornada = !!(fornadaAtual && (() => { const df = parseLocalDate(fornadaAtual.dataFim); df.setHours(0,0,0,0); return df > nowDay; })());
  const hasScheduledFornada = !!(fornadaProxima && (() => { const di = parseLocalDate(fornadaProxima.dataInicio); di.setHours(0,0,0,0); return di > nowDay; })());
  const hasNoFornada = !hasActiveFornada && !hasScheduledFornada;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString;
    }
  };

  const isWithinFornadaInterval = (fornadaData) => {
    if (!fornadaData || !fornadaData.dataInicio || !fornadaData.dataFim) return false;
    
    const now = new Date();
    const dataInicio = parseLocalDate(fornadaData.dataInicio);
    const dataFim = parseLocalDate(fornadaData.dataFim);
    
    dataInicio.setHours(0, 0, 0, 0);
    dataFim.setHours(23, 59, 59, 999);
    
    return now >= dataInicio && now <= dataFim;
  };

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

  const renderProductTable = () => {
    if (isEditing) {
      return (
        <div className="w-full flex justify-center m-0 p-0">
          <TableSelectProductsFornada />
        </div>
      );
    }

    if (hasNoFornada) {
      return (
        <div className="w-full flex justify-center">
          <TableSelectProductsFornada />
        </div>
      );
    }

    return (
      <div className="w-full flex justify-center items-center">
        <div className="w-full border-2 border-gold rounded-2xl bg-bgHome mx-auto">
          <div className="w-full">
            <header className="flex flex-row justify-between rounded-t-2xl px-6 py-4 items-center bg-gradient-blue h-[3.6875rem] w-full flex-shrink-0">
              <h1 className="text-gold text-[1.5rem]">Produtos da Fornada</h1>
              <div className="relative flex items-center w-[250px]">
                <input
                  type="text"
                  placeholder="Procurar produto"
                  className="h-[38px] w-full pl-2 pr-10 rounded-lg border border-gold focus:outline-none focus:border-blue transition-all duration-300 ease-in-out"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <LuSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[1.625rem] text-[#A47032] pointer-events-none" />
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
            <KPILastFornada key={kpiRefreshKey} kpiDataOverride={null} rangeOverride={null} refreshKey={kpiRefreshKey} />
            
            {/* Card central - muda baseado no estado e modo */}
            <div className="flex flex-col justify-center items-center w-[470px] h-[170px] border-2 border-gold rounded-2xl bg-bgHome gap-5 p-10 transition-all duration-500 ease-in-out">
              <div className="transition-all duration-300 ease-in-out">
                {renderCardContent()}
              </div>
            </div>

            <KPIThisMonthFornadas key={`month-${kpiRefreshKey}`} />
          </div>

          <div className={`flex flex-col w-full items-center gap-5 ${isEditing ? 'pt-0' : 'pt-5'}`}>
            {/* Tabela de produtos baseada no estado e modo */}
            <div className="transition-all duration-500 ease-in-out w-full flex justify-center">
              {renderProductTable()}
            </div>

            {/* Botões de ação baseados no estado e modo */}
            <div className="transition-all duration-300 ease-in-out">
            {isEditing ? (
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
              <button
                className="mb-5 flex items-center bg-gradient-to-l from-gold to-darkGold text-lg text-blue border-gold font-bold py-1 px-4 rounded-full shadow-md border-2 focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg"
                onClick={registerFornada}
              >
                CADASTRAR FORNADA <FaPlus className="inline ml-2" />
              </button>
            ) : (
              <div className="flex gap-4 mb-5">
                              <button
                className="flex items-center bg-gradient-to-l from-gold to-darkGold text-lg text-blue border-gold font-bold py-1 px-4 rounded-full shadow-md border-2 focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg"
                onClick={handleEditFornada}
              >
                EDITAR FORNADA <FaRegEdit className="inline ml-2" />
              </button>

                <button
                  className="flex items-center bg-gradient-to-l from-red to-brightRed text-lg text-white border-red font-bold py-1 px-4 rounded-full shadow-md border-2 focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg"
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

      <ModalConfirmarEdicao 
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); pendingFornadaIdRef.current = null; }}
        onConfirm={confirmEncerrar}
        step={"encerramento da fornada"}
      />

      <ModalConfirmarEdicao 
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={confirmCancelEdit}
        step={"cancelamento da edição"}
      />
    </div>
  );
}

export default FornadaDashboard;
