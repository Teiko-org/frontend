import React, { useState, useContext } from "react";
import { FormContext } from "../../contexts/FormContext";
import Button from "../../components/Button";
import { FaEdit } from "react-icons/fa";
import ModalMontagem from "../../components/ModalMontagem";
import ModalDecoracao from "../../components/ModalDecoracao";
import ModalAdicionais from "../../components/ModalAdicionais";
import ModalEntregaRetirada from "../../components/ModalEntregaRetirada";

const Step5 = () => {
  const [activeModal, setActiveModal] = useState(null);
  const { prevStep } = useContext(FormContext);

  const handlePrev = () => {
    prevStep();
  };

  const handleOpenModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="p-6 bg-bgNativeHome rounded-lg shadow-md">
      <h2 className="text-blue text-2xl mb-6 font-bold">Revise seu pedido</h2>
      
      {/* MONTAGEM */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">MONTAGEM</h3>
          <FaEdit className="text-gold cursor-pointer" onClick={() => handleOpenModal('montagem')} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-10 mb-6">
            <div className="flex flex-col gap-2">
              <span className="text-blue font-semibold">TAMANHO</span> 
              <span className="bg-gradient-to-l from-darkGoldButton to-goldButton rounded-full border-2 border-gold px-4 py-1 text-blue font-bold text-center">13cm</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-blue font-semibold">FORMATO</span> 
              <span className="bg-gradient-to-l from-darkGoldButton to-goldButton rounded-full border-2 border-gold px-4 py-1 text-blue font-bold text-center">Redondo</span>
            </div>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-blue font-semibold">MASSA</span> 
              Red-Velvet
            </div>
            <div className="flex flex-col">
              <span className="text-blue font-semibold">RECHEIO</span> 
              Brigadeiro de Pistache com Redução de Frutas Vermelhas
            </div>
          </div>
        </div>
      </div>

      {/* DECORAÇÃO */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">DECORAÇÃO</h3>
          <FaEdit className="text-gold cursor-pointer" onClick={() => handleOpenModal('decoracao')} />
        </div>
        <div className="flex flex-col">
          <span className="text-blue font-semibold">Observações</span> 
          Lorem ipsum dolor sit amet, consectetur adipiscing elit...
        </div>
      </div>

      {/* ADICIONAIS */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">ADICIONAIS</h3>
          <FaEdit className="text-gold cursor-pointer" onClick={() => handleOpenModal('adicionais')} />
        </div>
        <div className="flex gap-2">
          {["Cereja", "Glitter", "Perolado"].map((item, index) => (
            <span key={index} className="bg-gradient-to-l from-darkGoldButton to-goldButton border-2 border-gold rounded px-2 py-1 text-blue font-bold">{item}</span>
          ))}
        </div>
      </div>

      {/* DADOS ENTREGA */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">DADOS ENTREGA</h3>
          <FaEdit className="text-gold cursor-pointer" onClick={() => handleOpenModal('dadosEntrega')} />
        </div>
        <div className="grid grid-cols-2 gap-y-4 mb-4 text-blue">
          <div><span className="font-semibold">SEU PEDIDO SERÁ:</span> Entrega</div>
          <div><span className="font-semibold">DATA:</span> 99/99</div>
          <div><span className="font-semibold">NOME:</span> Murilo Do Nascimento Barros</div>
          <div><span className="font-semibold">TELEFONE:</span> (XX) X XXXX-XXXX</div>
        </div>
        <div className="grid grid-cols-3 mb-4 text-blue">
          <div><span className="font-semibold">CEP:</span> 00000-00</div>
          <div><span className="font-semibold">Estado:</span> SP</div>
          <div><span className="font-semibold">Cidade:</span> São Paulo</div>
        </div>
        <div className="grid grid-cols-2 gap-y-4 text-blue">
          <div><span className="font-semibold">Bairro:</span> Jardim Guairaca</div>
          <div><span className="font-semibold">Rua:</span> Rua Antônio Marques Julião</div>
          <div><span className="font-semibold">Número:</span> 9999</div>
          <div><span className="font-semibold">Complemento:</span> Inserir seu endereço</div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-gradient font-bold text-lg">
          VALOR ESTIMADO: R$ 999,99
        </div>
        <div>
          <Button
            text="Voltar"
            className="mr-4 px-6 py-1"
            onClick={handlePrev}
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
          <Button
            text="Finalizar Pedido"
            className="px-6 py-1"
            onClick={handlePrev}
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
        </div>
      </div>

      {activeModal === 'montagem' && (
        <ModalMontagem isOpen={!!activeModal} onClose={closeModal} />
      )}
      {activeModal === 'decoracao' && (
        <ModalDecoracao isOpen={!!activeModal} onClose={closeModal} />
      )}
      {activeModal === 'adicionais' && (
        <ModalAdicionais isOpen={!!activeModal} onClose={closeModal} />
      )}
      {activeModal === 'dadosEntrega' && (
        <ModalEntregaRetirada isOpen={!!activeModal} onClose={closeModal} />
      )}
    </div>
  );
};

export default Step5;