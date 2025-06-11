import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import CustomDatePicker from "../../components/DatePicker-3";
import TableSelectProductsFornada from "../../components/TableSelectProductsFornada";
import Button from "../../components/Button";
import HeaderDashboard from "../../components/headerDashboard";
import { fornadaService } from "../../service/fornadaService";
import fornadaDaVezService from "../../service/fornadaDaVezService";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { insertNewFornada } from "../../service/fornadaService"

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

  return (
    <div className="flex bg-bgNativeHome">
      <BarraLateralDashboard />

      <div className="w-full pl-56">
        <header className="pb-5 w-full">
          <HeaderDashboard title={"Fornada"} />
        </header>

        <div className="flex flex-col justify-evenly items-center gap-10">
          <div className="flex flex-col justify-center items-center w-[470px] h-[170px] border-2 border-gold rounded-2xl bg-bgHome gap-5 p-10">
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
          </div>
          <div className="flex flex-col w-full items-center gap-5">
            <TableSelectProductsFornada />
            <Button
              text={"INICIAR FORNADA"}
              onClick={() => registerFornada()}
            />
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
