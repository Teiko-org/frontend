import Button from "../Button";
import ModalBaseForm from "../ModalBaseForm";
import DataKPIFornada from "../DataKPIFornada/DataKPIFornada";
import ModalProductsFornada from "../ModalProductsFornada/ModalProductsFornada";
import { useState } from "react";

function ModalOtherFornadas(props) {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <ModalBaseForm title={"Consultar Fornadas Antigas"} onClose={props.onClose}>

            <div className="w-full flex flex-col justify-center items-center gap-y-4">

                <div className="w-full h-fit flex justify-between border-2 border-gold rounded-2xl bg-bgHome px-5 py-2">
                    <span>1ª Fornada: 99/99/9999 - 99/99/9999</span>
                    <Button variant="outline" onClick={openModal}>Consultar</Button>
                </div>

                <div
                    className={`flex flex-col w-[415px] h-fit justify-center border-2 border-gold rounded-2xl bg-bgHome px-5 py-2`}
                >

                    <DataKPIFornada />

                </div>
            </div>

            {isModalOpen && (
                <ModalProductsFornada
                    onClose={closeModal}
                />
            )}

        </ModalBaseForm>
    );
}

export default ModalOtherFornadas;