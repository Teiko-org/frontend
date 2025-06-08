import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import FornadaDatePicker from "../../components/FornadaDatePicker";
import TableSelectProductsFornada from "../../components/TableSelectProductsFornada";
import Button from "../../components/Button";
import HeaderDashboard from "../../components/headerDashboard";
import fornadaService from "../../service/fornadaService";
import fornadaDaVezService from "../../service/fornadaDaVezService";
import { useState } from "react";

function FornadaDashboard() {

  const [fornada, setFornada] = useState({
  dataInicio: "2023-10-01",
  dataFim: "2023-10-07",
});

const selectedProducts = localStorage.getItem("selectedProducts");

const [idFornada, setIdFornada] = useState(0);

const registerFornada = async () => {
  try {
    const response = await fornadaService();

    console.log(response);
    setIdFornada(response.id);
    registerFornadaDaVez();
  } catch (error) {
    console.log(error);
  }
};

const registerFornadaDaVez = async () => {
  try {
    const responses = await Promise.all(
      selectedProducts.forEach(produto => {

        fornadaDaVezService({
          produtoFornadaId: idFornada,
          fornadaId: produto.id,
          quantidade: produto.quantidade,
        });
        
      })
      
    );

    console.log(responses);
  } catch (error) {
    console.log(error);
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
          <FornadaDatePicker />
          <div className="flex flex-col w-full items-center gap-5">
            <TableSelectProductsFornada />
            <Button
              text={"INICIAR FORNADA"}
              onClick={() => registerFornada()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FornadaDashboard;
