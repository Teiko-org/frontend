import Button from "../Button";
import ModalBaseForm from "../ModalBaseForm";
import DataKPIFornada from "../DataKPIFornada/DataKPIFornada";

function ModalOtherFornadas() {

    return (
        <ModalBaseForm title={"Consultar Fornadas Antigas"}>

            <div className="w-full flex flex-col justify-center items-center gap-y-4">

                <div className="w-full h-fit flex justify-between border-2 border-gold rounded-2xl bg-bgHome px-5 py-2">
                    <span>1ª Fornada: 99/99/9999 - 99/99/9999</span>
                    <Button variant="outline">Consultar</Button>
                </div>

                <div
                    className={`flex flex-col w-[415px] h-fit justify-center border-2 border-gold rounded-2xl bg-bgHome px-5 py-2`}
                >

                    <DataKPIFornada />

                </div>
            </div>

        </ModalBaseForm>
    );
}

export default ModalOtherFornadas;