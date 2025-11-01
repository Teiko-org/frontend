import { useState } from "react";
import OrderStatusChanger from "../OrderStatusChanger";

function formatPhone(phone) {
  if (!phone) return "Carregando...";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7
    )}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6
    )}`;
  }
  return phone;
}

function formatDate(dateString) {
  if (!dateString) return "Carregando...";
  const date = new Date(dateString);
  if (isNaN(date)) return "Carregando...";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatCep(cep) {
  if (!cep) return "Carregando...";
  const cleaned = cep.replace(/\D/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return cep;
}

export default function ModalOrderDetails(props) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-60 flex justify-center pt-10 pb-5 modal-overlay modal-fixed">
      <div className="shadow-xl relative border bg-bgNativeHome border-[#d6a87c] w-[1000px] min-h-[150px] flex flex-col rounded-2xl modal-container modal-content modal-overflow-fix">
        <header className="flex justify-between bg-gradient-blue border-2 border-gold px-10 py-7 rounded-t-2xl">
          <div className="pl-10">
            <h1 className="text-3xl font-bold text-gold">
              Número do Pedido:{" "}
              {props.fornada == null
                ? props?.order?.numeroPedido ?? "Carregando..."
                : props.fornada}
            </h1>
            <h1 className="text-2xl font-thin text-white">
              {props?.order?.nomeCliente ?? "Carregando..."}
            </h1>
          </div>

          <button
            onClick={props.onClose}
            className="text-red text-3xl font-bold hover:scale-105 modal-close-button"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-10 py-4 rounded-b">
          <div className="flex flex-row gap-5">
            <div>
              {props.fornada == null ? (
                <div className="px-10 pt-5 pb-10 border-b border-[#FFC8B2]">
                  <h3 className="font-bold text-2xl text-blue pb-5">
                    Montagem
                  </h3>

                  <div className="grid grid-cols-2 gap-y-5">
                    <div className="gap-2">
                      <span className="text-blue font-semibold">Tamanho: </span>
                      <span>
                        {props?.order?.tamanho === "TAMANHO_5"
                          ? "5 centímetros"
                          : props?.order?.tamanho === "TAMANHO_7"
                          ? "7 centímetros"
                          : props?.order?.tamanho === "TAMANHO_12"
                          ? "12 centímetros"
                          : props?.order?.tamanho === "TAMANHO_15"
                          ? "15 centímetros"
                          : props?.order?.tamanho === "TAMANHO_17"
                          ? "17 centímetros"
                          : "Carregando..."}
                      </span>
                    </div>

                    <div className="gap-2">
                      <span className="text-blue font-semibold">Formato: </span>
                      <span>
                        {props?.order?.formato === "CORACAO"
                          ? "Coração"
                          : props?.order?.formato === "CIRCULO"
                          ? "Círculo"
                          : props?.order?.formato ?? "Carregando..."}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-blue font-semibold">Massa</span>
                      {props?.order?.massa ?? "Carregando..."}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-blue font-semibold">Recheio</span>
                      {props?.order?.recheio ?? "Carregando..."}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-10 pt-5 pb-10 border-b border-[#FFC8B2] flex flex-col">
                  <h3 className="font-bold text-2xl text-blue  pb-5">
                    Quantidade
                  </h3>
                  {props?.order?.quantidade} {props.fornada ? (props?.order?.produtoFornada ? `unidades de ${props.order.produtoFornada}` : 'unidades') : 'fatias/porções'}
                </div>
              )}

              <div className="px-10 pt-10 pb-10 border-b border-[#FFC8B2]">
                <div className="flex justify-between items-center pb-5">
                  <h3 className="font-bold text-2xl text-blue">Decoração</h3>
                </div>
                <div className="flex flex-col">
                  {props.fornada == null && (
                    <div className="italic pb-8">
                      {(() => {
                        const imagens = 
                          props?.order?.imagensDecoracao ||
                          (Array.isArray(props?.order?.imagens) ? props.order.imagens : []) ||
                          (props?.order?.decoracao ? [props.order.decoracao] : []) ||
                          (props?.order?.decoracaoUrl ? [props.order.decoracaoUrl] : []) ||
                          (props?.order?.imagemDecoracao ? [props.order.imagemDecoracao] : []);
                        
                        if (imagens && imagens.length > 0) {
                          return (
                            <div className="flex flex-wrap gap-4">
                              {imagens.map((imgSrc, index) => (
                                <img
                                  key={index}
                                  src={imgSrc}
                                  onError={() => setImgError(true)}
                                  alt={`Imagem de decoração ${index + 1}`}
                                  className="max-w-xs max-h-48 object-contain border border-gray-300 rounded"
                                />
                              ))}
                            </div>
                          );
                        }
                        return "Nenhuma imagem de referência adicionada";
                      })()}
                    </div>
                  )}

                  {props.fornada == null && (
                    <>
                      <span className="text-blue font-semibold">Observações</span>
                      {props?.order?.observacoes ||
                       props?.order?.observacao ||
                       props?.order?.descricaoDecoracao ||
                       "Nenhuma observação"}
                    </>
                  )}
                </div>
              </div>

              {props.fornada == null && (
                <div className="px-10 pt-10 pb-10 border-b border-[#FFC8B2]">
                  <h3 className="font-bold text-2xl text-blue pb-5">
                    Adicionais
                  </h3>
                  <div className="flex gap-2">
                    {(() => {
                      const add = props?.order?.adicionais;
                      let list = [];
                      if (Array.isArray(add)) list = add;
                      else if (typeof add === 'string' && add.trim().length > 0) list = add.split(',');
                      if (list.length === 0) return <span className="text-blue">Nenhum adicional</span>;
                      return list.map((item, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-l from-darkGoldButton to-goldButton border-2 border-gold rounded px-2 py-1 text-blue font-bold"
                        >
                          {String(item).trim()}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              )}

              <div className="px-10 pt-10 pb-10">
                <h3 className="font-bold text-2xl text-blue pb-5">
                  Dados Entrega
                </h3>

                <div className="grid grid-cols-2 gap-y-4 mb-4">
                  <div>
                    <span className="font-semibold text-blue">
                      O pedido será:
                    </span>{" "}
                    {props?.order?.tipoEntrega === "ENTREGA"
                      ? "Entrega"
                      : props?.order?.tipoEntrega === "RETIRADA"
                      ? "Retirada"
                      : "Carregando..."}
                  </div>
                  <div>
                    <span className="font-semibold text-blue">Data:</span>{" "}
                    {props?.order?.data
                      ? formatDate(props.order.data)
                      : props.order.dataPedido
                      ? formatDate(props.order.dataPedido)
                      : "Carregando..."}
                  </div>
                  {props?.order?.tipoEntrega === "RETIRADA" && (
                    <div>
                      <span className="font-semibold text-blue">Horário:</span>
                      {props?.order?.horarioRetirada || "Não especificado"}
                    </div>
                  )}
                </div>

                <div className="pt-5">
                  <h3 className="font-bold text-2xl text-blue pb-5">
                    Dados do Solicitante
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 mb-4">
                    <div>
                      <span className="font-semibold text-blue">Nome:</span>{" "}
                      {props?.order?.nomeCliente ?? "Carregando..."}
                    </div>
                    <div>
                      <span className="font-semibold text-blue">Telefone:</span>{" "}
                      {props?.order?.telefoneCliente
                        ? formatPhone(props.order.telefoneCliente)
                        : props?.order?.telefone
                        ? formatPhone(props.order.telefone)
                        : "Carregando..."}
                    </div>
                  </div>
                </div>

                {props?.order?.tipoEntrega !== "RETIRADA" && (
                  <div className="pt-5">
                    <h3 className="font-bold text-2xl text-blue pb-5">
                      Endereço
                    </h3>
                    <div className="grid grid-cols-3 mb-8">
                      <div>
                        <span className="font-semibold text-blue">CEP:</span>{" "}
                        {formatCep(props?.order?.endereco?.cep) ??
                          "Carregando..."}
                      </div>
                      <div>
                        <span className="font-semibold text-blue">Estado:</span>{" "}
                        {props?.order?.endereco?.estado ?? "Carregando..."}
                      </div>
                      <div>
                        <span className="font-semibold text-blue">Cidade:</span>{" "}
                        {props?.order?.endereco?.cidade ?? "Carregando..."}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-8">
                      <div>
                        <span className="font-semibold text-blue">Bairro:</span>{" "}
                        {props?.order?.endereco?.bairro ?? "Carregando..."}
                      </div>
                      <div>
                        <span className="font-semibold text-blue">Rua:</span>{" "}
                        {props?.order?.endereco?.logradouro ?? "Carregando..."}
                      </div>
                      <div>
                        <span className="font-semibold text-blue">Número:</span>{" "}
                        {props?.order?.endereco?.numero ?? "Carregando..."}
                      </div>
                      <div>
                        <span className="font-semibold text-blue">
                          Complemento:{" "}
                        </span>
                        {props?.order?.endereco?.complemento ?? "Carregando..."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <OrderStatusChanger
              orderSummaryId={props.orderSummaryId}
              orderStatus={props.orderStatus}
              onStatusChange={props.onStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
