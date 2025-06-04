import React, { useEffect, useState } from "react";
import orderFornada from "../../services/orderFornada";
import orderCake from "../../services/orderCake";
import getAddressById from "../../services/getAddressById";

export default function ModalOrderDetails(props) {

  const idPedidoBolo = props.order.pedidoBoloId;
  const idPedidoFornada = props.order.pedidoFornadaId;

  const [detalhesPedido, setDetalhesPedido] = useState([]);

  const requests = async () => {

    let resposta;

    if (idPedidoBolo != null) {

      resposta = await orderCake(idPedidoBolo);

    } else if (idPedidoFornada != null) {

      resposta = await orderFornada(idPedidoFornada);

    }
    
    console.log(resposta);

    let endereco = await getAddressById(resposta.endereco);

    setDetalhesPedido(props?.order, resposta, endereco);

    console.log(detalhesPedido);

  };

  useEffect(() => {
    requests();
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center pt-10 pb-5">
      <div className="shadow-xl relative border bg-bgNativeHome border-[#d6a87c] w-[810px] min-h-[150px] flex flex-col rounded-2xl">
        <header className="flex justify-between bg-gradient-blue border-2 border-gold px-10 py-7 rounded-t-2xl">

          <div className="pl-10">
            <h1 className="text-3xl font-bold text-gold">
              Número do Pedido: {detalhesPedido?.order?.id ?? "Carregando..."}
            </h1>
            <h1 className="text-2xl font-thin text-white">
              {detalhesPedido?.nome ?? "Carregando..."}
            </h1>
          </div>

          <button
            onClick={props.onClose}
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
                <span>{detalhesPedido?.nome ?? "Carregando..."}</span>
              </div>

              <div className="gap-2">
                <span className="text-blue font-semibold">Formato: </span>
                <span>{detalhesPedido?.nome ?? "Carregando..."}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-blue font-semibold">Massa</span>
                {detalhesPedido?.nome ?? "Carregando..."}
              </div>

              <div className="flex flex-col">
                <span className="text-blue font-semibold">Recheio</span>
                {detalhesPedido?.nome ?? "Carregando..."}
              </div>
            </div>
          </div>

          <div className="px-10 pt-10 pb-10 border-b border-[#FFC8B2]">
            <div className="flex justify-between items-center pb-5">
              <h3 className="font-bold text-2xl text-blue">Decoração</h3>
            </div>
            <div className="flex flex-col">
              <span className="italic pb-8">

                {detalhesPedido?.imagem ? "props.order.imagem" : "Nenhuma imagem de referência adicionada"}

              </span>
              <span className="text-blue font-semibold">Observações</span>
              {detalhesPedido?.nome ?? "Carregando..."}
            </div>
          </div>

          <div className="px-10 pt-10 pb-10 border-b border-[#FFC8B2]">
            <h3 className="font-bold text-2xl text-blue pb-5">Adicionais</h3>
            <div className="flex gap-2">
              {detalhesPedido?.adicionais?.split(",").map((item, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-l from-darkGoldButton to-goldButton border-2 border-gold rounded px-2 py-1 text-blue font-bold"
                >
                  {item}
                </span>
              )) ?? "Carregando..."}
            </div>
          </div>

          <div className="px-10 pt-10 pb-10">
            <h3 className="font-bold text-2xl text-blue pb-5">Dados Entrega</h3>

            <div className="grid grid-cols-2 gap-y-4 mb-4">
              <div>
                <span className="font-semibold text-blue">O pedido será:</span> {detalhesPedido?.tipo ?? "Carregando..."}
              </div>
              <div>
                <span className="font-semibold text-blue">Data:</span> {detalhesPedido?.dataEntrega ?? "Carregando..."}
              </div>
            </div>

            <div className="pt-5">
              <h3 className="font-bold text-2xl text-blue pb-5">
                Dados do Solicitante
              </h3>
              <div className="grid grid-cols-2 gap-y-4 mb-4">
                <div>
                  <span className="font-semibold text-blue">Nome:</span> {detalhesPedido?.nome ?? "Carregando..."}
                </div>
                <div>
                  <span className="font-semibold text-blue">Telefone:</span> {detalhesPedido?.telefone ?? "Carregando..."}
                </div>
              </div>
            </div>

            <div className="pt-5">
              <h3 className="font-bold text-2xl text-blue pb-5">Endereço</h3>
              <div className="grid grid-cols-3 mb-8">
                <div>
                  <span className="font-semibold text-blue">CEP:</span> {detalhesPedido?.cep ?? "Carregando..."}
                </div>
                <div>
                  <span className="font-semibold text-blue">Estado:</span> {detalhesPedido?.estado ?? "Carregando..."}
                </div>
                <div>
                  <span className="font-semibold text-blue">Cidade:</span> {detalhesPedido?.cidade ?? "Carregando..."}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-8">
                <div>
                  <span className="font-semibold text-blue">Bairro:</span> {detalhesPedido?.bairro ?? "Carregando..."}
                </div>
                <div>
                  <span className="font-semibold text-blue">Rua:</span> {detalhesPedido?.logradouro ?? "Carregando..."}
                </div>
                <div>
                  <span className="font-semibold text-blue">Número:</span> {detalhesPedido?.numero ?? "Carregando..."}
                </div>
                <div>
                  <span className="font-semibold text-blue">Complemento: </span>
                  {detalhesPedido?.complemento ?? "Carregando..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
