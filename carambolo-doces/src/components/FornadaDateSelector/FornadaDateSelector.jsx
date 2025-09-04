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
import { insertNewFornada } from "../../service/fornadaService"
import KPILastFornada from "../../components/KPILastFornada";
import KPIThisMonthFornadas from "../../components/KPIThisMonthFornadas";
import { getFornadaAtiva } from "../../service/fornadaService";

function FornadaDateSelector() {
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
      }
    };

    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [fornadaData]);

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
          <p className="pb-5">{fornadaAtual ? (<h1 className="font-bold text-blue">Já há uma Fornada acontecendo no momento</h1>) : (<h1 className="font-bold text-blue">Não há nenhuma fornada acontecendo no momento</h1>)}</p>
          <div className="flex flex-row justify-evenly items-center gap-10">
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
                {fornadaAtual ? (
                  <div>
                    <span>{String(timeLeft.days).padStart(2, '0')} Dias {String(timeLeft.hours).padStart(2, '0')} Horas {String(timeLeft.minutes).padStart(2, '0')} Minutos {String(timeLeft.seconds).padStart(2, '0')} Segundos </span>
                  </div>
                ) : (
                  <span>{fornadaProxima.dataInicio} - {fornadaProxima.dataFim}</span>

                )}
              </>)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FornadaDateSelector;
