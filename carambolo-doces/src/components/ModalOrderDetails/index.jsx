import React from "react";

export default function ModalOrderDetails({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center pt-10 pb-5">
      <div className="shadow-xl relative border bg-bgNativeHome border-[#d6a87c] w-[810px] min-h-[150px] flex flex-col rounded-2xl">
        <header className="flex justify-between bg-gradient-blue border-2 border-gold px-10 py-7 rounded-t-2xl">

          <div className="pl-10">
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

        <div className="flex-1 overflow-y-auto px-10 py-4  rounded-b">
          <div className="px-10 pt-5 pb-10 border-b border-[#FFC8B2]">
            <h3 className="font-bold text-2xl text-blue pb-5">Montagem</h3>

            <div className="grid grid-cols-2 gap-y-5">
                <div className="gap-2">
                  <span className="text-blue font-semibold">Tamanho: </span>
                  <span>13cm</span>
                </div>

                <div className="gap-2">
                  <span className="text-blue font-semibold">Formato: </span>
                  <span>Redondo</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-blue font-semibold">Massa</span>
                  Red-Velvet
                </div>

                <div className="flex flex-col">
                  <span className="text-blue font-semibold">Recheio</span>
                  Brigadeiro de Pistache com Redução de Frutas Vermelhas
                </div>
            </div>
          </div>

          <div className="px-10 pt-10 pb-10 border-b border-[#FFC8B2]">
            <div className="flex justify-between items-center pb-5">
              <h3 className="font-bold text-2xl text-blue">Decoração</h3>
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

          <div className="px-10 pt-10 pb-10 border-b border-[#FFC8B2]">
            <h3 className="font-bold text-2xl text-blue pb-5">Adicionais</h3>
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

          <div className="px-10 pt-10 pb-10">
            <h3 className="font-bold text-2xl text-blue pb-5">Dados Entrega</h3>

            <div className="grid grid-cols-2 gap-y-4 mb-4">
              <div>
                <span className="font-semibold text-blue">O pedido será:</span> Entrega
              </div>
              <div>
                <span className="font-semibold text-blue">Data:</span> 99/99
              </div>
            </div>

            <div className="pt-5">
              <h3 className="font-bold text-2xl text-blue pb-5">
                Dados do Solicitante
              </h3>
              <div className="grid grid-cols-2 gap-y-4 mb-4">
                <div>
                  <span className="font-semibold text-blue">Nome:</span> Murilo Do
                  Nascimento Barros
                </div>
                <div>
                  <span className="font-semibold text-blue">Telefone:</span> +55 (11) 96809-0282
                </div>
              </div>
            </div>

            <div className="pt-5">
              <h3 className="font-bold text-2xl text-blue pb-5">Endereço</h3>
              <div className="grid grid-cols-3 mb-8">
                <div>
                  <span className="font-semibold text-blue">CEP:</span> 00000-00
                </div>
                <div>
                  <span className="font-semibold text-blue">Estado:</span> SP
                </div>
                <div>
                  <span className="font-semibold text-blue">Cidade:</span> São Paulo
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-8">
                <div>
                  <span className="font-semibold text-blue">Bairro:</span> Jardim Guairaca
                </div>
                <div>
                  <span className="font-semibold text-blue">Rua:</span> Rua Antônio
                  Marques Julião
                </div>
                <div>
                  <span className="font-semibold text-blue">Número:</span> 9999
                </div>
                <div>
                  <span className="font-semibold text-blue">Complemento:</span> Inserir
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
