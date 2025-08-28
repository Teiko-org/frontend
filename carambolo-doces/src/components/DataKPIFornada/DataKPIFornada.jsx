function DataKPIFornada() {

    return (
        <>
            <p className="w-full flex justify-end text-sm">Vendido | Total</p>

            <div className="flex flex-col gap-y-1 items-end justify-center">

                <span className="w-full flex justify-between">Total Vendidos:
                    <span>
                        <span className="text-green">99</span> / <span className="text-green">99</span>
                    </span>
                </span>

                <span className="w-full flex justify-between">Valor Total:
                    <span>
                        <span className="text-green">99</span> / <span className="text-green">99</span>
                    </span>
                </span>

                <span className="w-full flex justify-between">Valor Perdido:
                    <span className="text-red">R$ -99,99</span >
                </span>

            </div>
        </>
    );
}

export default DataKPIFornada;