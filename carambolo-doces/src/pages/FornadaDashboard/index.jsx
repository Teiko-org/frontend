import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import FornadaDatePicker from "../../components/FornadaDatePicker";
import TableSelectProductsFornada from "../../components/TableSelectProductsFornada";
import Button from "../../components/Button";
import HeaderDashboard from "../../components/headerDashboard";
import fornadaService from "../../service/fornadaService";
import fornadaDaVezService from "../../service/fornadaDaVezService";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

  function formatDate(date) {
    const formattedDate = new Date(date);

    const yyyy = formattedDate.getFullYear();
    const mm = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(formattedDate.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

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
      const response = await fornadaService(fornada);

      registerFornadaDaVez(response.id);
    } catch (error) {
      console.error(error);
    }
  };

  const notify = () => {
    toast("Fornada cadastrada com sucesso! Redirecionando...", {
      type: "success",
    });
    setTimeout(() => {
      navigate("/dashboard-pedidos-kanban");
    }, 3000);
  };

  const registerFornadaDaVez = async (idFornada) => {
    try {
      const selectedProductsJson = JSON.parse(
        localStorage.getItem("selectedProducts")
      );

      const responses = await Promise.all(
        selectedProductsJson.map((produto) => {
          return (
            fornadaDaVezService({
              fornadaId: idFornada,
              produtoFornadaId: produto.id,
              quantidade: produto.quantidade,
            }),
            notify()
          );
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex bg-bgNativeHome">
      <BarraLateralDashboard />

      <div className="w-full">
        <header className="pb-5">
          <HeaderDashboard title={"Fornada"} />
        </header>

        <div className="flex flex-col justify-evenly items-center gap-24">
          <FornadaDatePicker
            dataInicio={
              fornada.dataInicio ? new Date(fornada.dataInicio) : null
            }
            dataFim={fornada.dataFim ? new Date(fornada.dataFim) : null}
            onChangeInicio={(date) =>
              handleDateChange("dataInicio", formatDate(date))
            }
            onChangeFim={(date) => {
              handleDateChange("dataFim", formatDate(date));
            }}
          />
          <div className="flex flex-col w-full items-center gap-5">
            <TableSelectProductsFornada />
            <Button
              text={"INICIAR FORNADA"}
              onClick={() => registerFornada()}
            />
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FornadaDashboard;
