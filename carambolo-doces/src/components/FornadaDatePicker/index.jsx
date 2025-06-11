import CustomDatePicker from "../DatePicker";

function FornadaDatePicker({
  dataInicio,
  dataFim,
  onChangeInicio,
  onChangeFim,
}) {
  return (
    <div
      className={`flex flex-col justify-center items-center w-[470px] h-[170px]  border-2 border-gold rounded-2xl bg-bgHome gap-5 p-10`}
    >
      <h3 className="font-bold">Iniciar Nova Fornada</h3>

      <div className="flex justify-center gap-20">
        <CustomDatePicker
          label={"De:"}
          value={dataInicio}
          onChange={onChangeInicio}
          placeholderText="Data Início"
        />
        <CustomDatePicker
          label={"Até:"}
          value={dataFim}
          onChange={onChangeFim}
          placeholderText="Data Fim"
        />
      </div>
    </div>
  );
}

export default FornadaDatePicker;
