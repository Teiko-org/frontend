import Button from "../../components/Button";

function DashboardFornadaData() {

    return (

        <div className="w-full h-fit flex justify-between items-center border-2 border-gold rounded-2xl bg-bgNativeHome px-5 py-2">
            <div className="flex flex-col gap-y-2">
                <p><span className="font-semibold">1ª Fornada:</span> 99/99/9999 - 99/99/9999</p>

                <div className="flex gap-x-20">
                    <p className="text-sm">Total Vendidos: <span className="text-green pl-5"> 99 </span> / <span className="text-green">99</span></p>
                    <p className="text-sm">Valor Total: <span className="text-green pl-5">R$ 99,99 </span> / <span className="text-green">R$ 99,99</span></p>
                    <p className="text-sm">Valor Perdido: <span className="text-red pl-5">R$ -99,99</span></p>
                </div>
            </div>
            <Button className="h-fit" variant="outline">Consultar</Button>
        </div>

    );
}

export default DashboardFornadaData;