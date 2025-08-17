import Button from "../Button";
import ModalBaseForm from "../ModalBaseForm";
import DataKPIFornada from "../DataKPIFornada/DataKPIFornada";

function ModalProductsFornada(props) {

    return (
        <ModalBaseForm title={"Produtos Fornada: 99/99/9999 - 99/99/9999"} onClose={props.onClose}>

            <div className="w-full flex justify-center">

                <div
                    className={`flex flex-col w-[415px] h-fit justify-center border-2 border-gold rounded-2xl bg-bgHome px-5 py-2`}
                >

                    <DataKPIFornada />

                </div>
            </div>

        </ModalBaseForm>
    );
}

export default ModalProductsFornada;