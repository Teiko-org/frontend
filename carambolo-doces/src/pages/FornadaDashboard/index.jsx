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
import { insertNewFornada } from "../../service/fornadaService";
import KPILastFornada from "../../components/KPILastFornada";
import KPIThisMonthFornadas from "../../components/KPIThisMonthFornadas";
import { getFornadaAtiva, getProdutosFornadaComImagens } from "../../service/fornadaService";
import { FaRegEdit, FaPlus } from "react-icons/fa";
import TableProductsThisFornada from "../../components/TableProductsThisFornada/TableProductsThisFornada";

function FornadaDashboard() {
  const navigate = useNavigate();

  const [fornada, setFornada] = useState({
    dataInicio: "",
    dataFim: "",
  });

  const handleDateChange = (field, value) => {
    setFornada((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  const registerFornada = async () => {
    if (!fornada.dataInicio || !fornada.dataFim) {
      toast("Preencha as duas datas!", { type: "error" });
      return;
    }

    const dataInicio = new Date(fornada.dataInicio);
    const dataFim = new Date(fornada.dataFim);

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
      } else {
        toast.error("Erro ao cadastrar fornada!");
      }
    } catch (error) {
      console.error("Erro ao cadastrar fornada:", error);
      toast.error("Erro ao cadastrar fornada! Tente novamente.");
    }
  };

  const notify = () => {
    toast("Fornada cadastrada com sucesso! Redirecionando...", {
      type: "success",
    });
    setTimeout(() => {
      navigate("/dashboard-kanban-pedidos");
    }, 3000);
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

      const fornadaAtual = await getFornadaAtiva();

      if (fornadaAtual) {
        setFornadaAtual(fornadaAtual);
        // const produtos = await getProdutosFornadaComImagens(fornadaAtual.id);
        // setProdutosFornada(produtos.slice(0, 4));

      }

      if (fornadaProxima) {
        setFornadaProxima(fornadaProxima);
        console.log("aAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + fornadaProxima);
        // const produtos = await getProdutosFornadaComImagens(fornadaProxima.id);
        // setProdutosFornada(produtos.slice(0, 4));


      }
    } catch (error) {
      console.error("Erro ao carregar dados da fornada:", error);
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

  // const formatEndDate = () => {
  //   if (!fornadaData || !fornadaData.dataFim) {
  //     return "";
  //   }

  //   const date = new Date(fornadaData.dataFim);
  //   return date.toLocaleDateString('pt-BR');
  // };

  return (
    <div className="flex h-full bg-bgNativeHome">
      <BarraLateralDashboard />

      <div className="w-full h-full pl-56">
        <header className="w-full">
          <HeaderDashboard title={"Fornada"} />
        </header>

        <div className="flex flex-col justify-evenly items-center">
          <p className="pb-5 font-bold text-blue">{fornadaAtual ? (fornadaProxima ? ("Já há uma Fornada cadastrada no momento") : <h1 className="font-bold text-blue">Já há uma Fornada acontecendo no momento</h1>) : (<h1 className="font-bold text-blue">Não há nenhuma fornada acontecendo no momento</h1>)}</p>
          <div className="flex flex-row justify-evenly items-center gap-10">
            <KPILastFornada />
            <div className="flex flex-col justify-center items-center w-[470px] h-[170px] border-2 border-gold rounded-2xl bg-bgHome gap-5 p-10">
              {!fornadaAtual ? (
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
                    />
                  </div>
                </>
              ) : (<>
                <h3 className="font-bold text-blue">Duração da Fornada Cadastrada</h3>
                {fornadaAtual && isFornadaAtiva(fornadaAtual) ? (
                  <div>
                    <span>
                      {String(timeLeft.days).padStart(2, '0')} Dias {String(timeLeft.hours).padStart(2, '0')} Horas {String(timeLeft.minutes).padStart(2, '0')} Minutos {String(timeLeft.seconds).padStart(2, '0')} Segundos
                    </span>
                  </div>
                ) : fornadaProxima ? (
                  <span>
                    {fornadaProxima.dataInicio} - {fornadaProxima.dataFim}
                  </span>
                ) : null}
              </>)}

            </div>
            <KPIThisMonthFornadas />
          </div>
          <div className="flex flex-col w-full items-center gap-5 pt-5">

            {fornadaAtual || fornadaProxima ? (
              <div className="w-full flex justify-center">

                <TableProductsThisFornada idFornada={fornadaAtual.id || fornadaProxima.id} roundedTop={true} amountLeft={true}/>

              </div>
            ) : (
              <TableSelectProductsFornada/>
            )}
            <button
              className="mb-5 flex items-center bg-gradient-to-l from-gold to-darkGold text-lg text-blue border-gold font-bold py-1 px-4 rounded-full shadow-md border-2 focus:outline-none"
              onClick={fornadaAtual || fornadaProxima ? () => console.log("aaaAAAAAAAAAAAAAAaa") : () => registerFornada()}
            >
              {fornadaAtual || fornadaProxima ? (
                <>
                  EDITAR FORNADA <FaRegEdit className="inline ml-2" />
                </>
              ) : (
                <>
                  CADASTRAR FORNADA <FaPlus className="inline ml-2" />
                </>
              )}
            </button>
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
