import DatePicker from "../DatePicker";

function FornadaDatePicker() {

    return (
        <div
            className={`flex flex-col justify-center items-center w-[470px] h-[170px]  border-2 border-gold rounded-2xl bg-bgHome gap-5 p-10`}
        >
            <h3 className="font-bold">Iniciar Nova Fornada</h3>

            <div className="flex justify-center gap-20">
                    <DatePicker label={"De:"}/>

                    <DatePicker label={"Até:"}/>

            </div>

        </div>
    );
}

export default FornadaDatePicker;