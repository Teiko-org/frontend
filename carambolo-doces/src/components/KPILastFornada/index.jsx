import { useState } from "react";
import Button from "../Button";
import DataKPIFornada from "../DataKPIFornada/DataKPIFornada";
import ModalProductsFornada from "../ModalProductsFornada/ModalProductsFornada";

function KPILastFornada() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="m-0 h-fit w-fit g-0 bg-gradient-to-l from-gold to-darkGold rounded-2xl border-1 border-gold shadow-md">
      <div
        className={`flex flex-col w-[350px] h-[140px] justify-center border-2 border-gold rounded-2xl bg-bgHome p-5`}
      >

        <div className="flex justify-center gap-x-1">
          <span className="font-bold">Última Fornada:</span>
          <span>99/99/99 - 99/99/99</span>
        </div>

        <DataKPIFornada />

      </div>

      <button onClick={openModal} className="p-1 w-full font-bold text-blue rounded-2xl border-none focus:outline-none transform hover:scale-105 transition-transform">Consultar Produtos</button>

      {isModalOpen && (
        <ModalProductsFornada
          onClose={closeModal}
        />
      )}

    </div>
  );
}

export default KPILastFornada;