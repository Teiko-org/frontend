import {
  orderSummaryStatusCancelado,
  orderSummaryStatusPendente,
  orderSummaryStatusPago,
  orderSummaryStatusConcluido
} from "../../service/orderSummaryStatus.js";

function OrderStatusChanger(props) {
    const statusList = [
        { label: "Cancelado", value: "CANCELADO", className: "bg-red", onclick: () => changeStatus("CANCELADO") },
        { label: "Pendente", value: "PENDENTE", className: "bg-yellow-700", onclick: () => changeStatus("PENDENTE") },
        { label: "Pago", value: "PAGO", className: "bg-light-blue-300", onclick: () => changeStatus("PAGO") },
        { label: "Concluído", value: "CONCLUIDO", className: "bg-light-green-700", onclick: () => changeStatus("CONCLUIDO") },
    ];

    const changeStatus = async (status) => {
        try {
            let resposta;
            if (status == "CANCELADO") {
                resposta = await orderSummaryStatusCancelado(props.orderSummaryId);
            } else if (status == "PENDENTE") {
                resposta = await orderSummaryStatusPendente(props.orderSummaryId);
            } else if (status == "PAGO") {
                resposta = await orderSummaryStatusPago(props.orderSummaryId);
            } else if (status == "CONCLUIDO") {
                resposta = await orderSummaryStatusConcluido(props.orderSummaryId);
            }
            console.log(`Status do pedido alterado para: ${status}  - Resposta:`, resposta);
            if (props.onStatusChange) props.onStatusChange();
        } catch (error) {
            console.error("Erro ao alterar o status do pedido:", error);
        }
    };

    return (
        <div className="bg-gradient-blue p-1 w-60 h-fit border border-gold rounded-lg sticky top-0">
            <header className="text-gold font-bold p-2 py-2">Mudar status do pedido:
            </header>
            <div className="bg-bgHome p-2 flex flex-col gap-2 rounded-lg border border-gold">
                {statusList
                    .filter(status => status.value !== props.orderStatus)
                    .map(status => (
                        <button
                            key={status.value}
                            className={`${status.className} text-white font-bold rounded-lg p-2`}
                            onClick={status.onclick}
                        >
                            {status.label}
                        </button>
                    ))}
            </div>
        </div>
    );
}

export default OrderStatusChanger;