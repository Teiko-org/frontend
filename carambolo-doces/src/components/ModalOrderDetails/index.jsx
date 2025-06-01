import React from "react";

export default function ModalOrderDetails({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center pt-10 pb-5">
      <div className="bg-white shadow-xl relative border border-[#d6a87c] w-[810px] min-h-[150px] flex flex-col rounded rounded-t-3xl">
        <header className="flex justify-between bg-gradient-blue px-10 py-7 rounded-t-3xl">
          <div>
            <h1 className="text-3xl font-bold text-gold">
              Número do Pedido: 9999999
            </h1>
            <h1 className="text-2xl font-thin text-white">
              Bolo de Cenoura c/ cobertura de Chocolate
            </h1>
          </div>

          <button
            onClick={onClose}
            className="text-red text-3xl font-bold hover:scale-105"
          >
            ✕
          </button>
        </header>
        <div
          className="h-[2px]"
          style={{
            background: "linear-gradient(0deg, #A47032 0%, #D4B076 100%)",
          }}
        ></div>

        <div className="flex-1 overflow-y-auto px-6 py-4 bg-bgNativeHome rounded-b">
          <div className="mb-5 pb-4 border-b border-gray-300">
            <h3 className="font-bold text-lg text-blue mb-3">MONTAGEM</h3>

            <div className="flex flex-col gap-2">
              <div className="flex gap-10 mb-6">
                <div className="gap-2">
                  <span className="text-blue font-semibold">TAMANHO: </span>
                  <span>13cm</span>
                </div>

                <div className="gap-2">
                  <span className="text-blue font-semibold">FORMATO: </span>
                  <span>Redondo</span>
                </div>
              </div>

              <div className="flex gap-14">
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
            </div>
            <div className="flex flex-col">
              <span className="italic pb-8">
                Nenhuma imagem de referência adicionada
              </span>
              <span className="text-blue font-semibold">Observações</span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu
              mauris, aliquet nec pulvinar a, rhoncus eu tortor. Phasellus at
              mauris posuere, placerat ante eu, tincidunt libero. Vivamus
              ultrices porttitor dui. Phasellus eu pellentesque metus.
              Suspendisse quis arcu tortor. Curabitur non rutrum massa. Aenean a
              varius lectus. Phasellus quis tristique elit.
            </div>
          </div>

          {/* ADICIONAIS */}
          <div className="mb-5 pb-4 border-b border-gray-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-blue">ADICIONAIS</h3>
            </div>
            <div className="flex gap-2">
              {["Cereja", "Glitter", "Perolado"].map((item, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-l from-darkGoldButton to-goldButton border-2 border-gold rounded px-2 py-1 text-blue font-bold"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* DADOS ENTREGA */}
          <div className="mb-5 pb-4 border-b">
            <div className="flex justify-between items-center mb-3">

              <h3 className="font-bold text-lg text-blue">DADOS ENTREGA</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-4 mb-4 text-blue">
              <div>
                <span className="font-semibold">SEU PEDIDO SERÁ:</span> Entrega
              </div>
              <div>
                <span className="font-semibold">DATA:</span> 99/99
              </div>
            </div>

            <div className="pt-5">
              <h3 className="font-bold text-lg text-blue">
                Dados do Solicitante
              </h3>
              <div className="grid grid-cols-2 gap-y-4 mb-4 text-blue">
                <div>
                  <span className="font-semibold">NOME:</span> Murilo Do
                  Nascimento Barros
                </div>
                <div>
                  <span className="font-semibold">TELEFONE:</span> (XX) X
                  XXXX-XXXX
                </div>
              </div>
            </div>

            <div className="pt-5">
              <h3 className="font-bold text-lg text-blue">Endereço</h3>
              <div className="grid grid-cols-3 mb-4 text-blue">
                <div>
                  <span className="font-semibold">CEP:</span> 00000-00
                </div>
                <div>
                  <span className="font-semibold">Estado:</span> SP
                </div>
                <div>
                  <span className="font-semibold">Cidade:</span> São Paulo
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4 text-blue">
                <div>
                  <span className="font-semibold">Bairro:</span> Jardim Guairaca
                </div>
                <div>
                  <span className="font-semibold">Rua:</span> Rua Antônio
                  Marques Julião
                </div>
                <div>
                  <span className="font-semibold">Número:</span> 9999
                </div>
                <div>
                  <span className="font-semibold">Complemento:</span> Inserir
                  seu endereço
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
