import React, { useContext, useEffect } from "react";
import { FormContext } from "../../contexts/FormContext";
import { useFormContext, Controller } from "react-hook-form";
import Button from "../../components/Button";
import Select from "../../components/Select";
import InputOption from "../../components/InputOption";
import CustomDatePicker from "../../components/DatePicker";
import PhoneNumberInput from "../../components/PhoneInput";
import CampoComGradiente from "../../components/gradientField";
import { searchAddressByCep } from "../../service/viaCepService";

const Step4 = () => {
  const { nextStep, prevStep, appendFormData } = useContext(FormContext);
  const { control, handleSubmit, setValue, watch } = useFormContext();

  const onSubmit = (data) => {
  const plainData = {
    ...data,
    data: data.data ? data.data.toString() : '',
    horario: data.horario || '',
    telefone: data.telefone || '',
  };

  appendFormData(plainData);
  console.log("Step 4 data:", plainData);
  nextStep();
};

  const handlePrev = () => {
    prevStep();
  };

  const cep = watch("cep", "");
  const deliveryOption = watch("deliveryOption", "Entrega");

  useEffect(() => {
    if (deliveryOption === "Entrega") {
      setValue("horario", null);
    } else if (deliveryOption === "Retirada") {
      setValue("cep", "");
      setValue("estado", "");
      setValue("cidade", "");
      setValue("bairro", "");
      setValue("rua", "");
      setValue("numero", "");
      setValue("complemento", "");
    }
  }, [deliveryOption, setValue]);

  useEffect(() => {
    if (cep.replace("-", "").length === 8) {
      fetchAddressByCep(cep);
    }
  }, [cep]);

  const handleCepChange = (value) => {
    const formattedValue = formatCep(value);
    setValue("cep", formattedValue);

    if (formattedValue.replace("-", "").length === 8) {
      fetchAddressByCep(formattedValue);
    } else {
      cleanAddressFields();
    }
  };

  const fetchAddressByCep = async (typedCep) => {
    await searchAddressByCep(
      typedCep.replace("-", ""),
      (val) => setValue("estado", val),
      (val) => setValue("cidade", val),
      (val) => setValue("bairro", val),
      (val) => setValue("rua", val),
      cleanAddressFields
    );
  };

  const cleanAddressFields = () => {
    setValue("estado", "");
    setValue("cidade", "");
    setValue("bairro", "");
    setValue("rua", "");
  };

  const formatCep = (value) =>
    value.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");

  const preventEnterSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <div className="flex space-x-4 mt-2 mb-4">
          <h2 className="font-semibold tracking-wider text-xl text-blue">
            Seu pedido será?
          </h2>
          {["Entrega", "Retirada"].map((option) => (
            <Controller
              key={option}
              name="deliveryOption"
              control={control}
              defaultValue="Entrega"
              render={({ field }) => (
                <InputOption
                  type="radio"
                  label={option}
                  checked={field.value === option}
                  onChange={() => {
                    field.onChange(option);
                    setValue("horario", null);
                  }}
                />
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label className="block text-blue font-semibold mb-1">Nome</label>
          <Controller
            name="nome"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                placeholder="Inserir o seu nome"
                className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                onKeyPress={preventEnterSubmit}
              />
            )}
          />
        </div>
        <div className="col-span-4">
          <label className="block text-blue font-semibold mb-1">Telefone</label>
          <CampoComGradiente>
            <Controller
              name="telefone"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PhoneNumberInput
                  {...field}
                  placeholder="(XX) X XXXX-XXXX"
                  className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                  onKeyPress={preventEnterSubmit}
                />
              )}
            />
          </CampoComGradiente>
        </div>
        <div className="col-span-2">
          <Controller
            name="data"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <CustomDatePicker
                value={field.value}
                onChange={field.onChange}
                label="Data"
                placeholder="DD/MM"
                onKeyPress={preventEnterSubmit}
              />
            )}
          />
        </div>

        {deliveryOption === "Entrega" && (
          <>
            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">CEP</label>
              <Controller
                name="cep"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                    maxLength={9}
                    onChange={(e) => handleCepChange(e.target.value)}
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
              <span className="text-xs text-blue mt-1">
                Não sabe o CEP?{" "}
                <a
                  href="https://www.buscacep.correios.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue font-semibold underline"
                >
                  Clique Aqui
                </a>
              </span>
            </div>
            <div className="col-span-2">
              <Controller
                name="estado"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Estado"
                    options={[{ value: "SP", label: "SP" }]}
                    disabled={true}
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">
                Cidade
              </label>
              <Controller
                name="cidade"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">
                Bairro
              </label>
              <Controller
                name="bairro"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
            </div>

            <div className="col-span-8">
              <label className="block text-blue font-semibold mb-1">
                Endereço
              </label>
              <Controller
                name="rua"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">
                Número
              </label>
              <Controller
                name="numero"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
            </div>

            <div className="col-span-8">
              <label className="block text-blue font-semibold mb-1">
                Complemento
              </label>
              <Controller
                name="complemento"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
            </div>
          </>
        )}
        {deliveryOption === "Retirada" && (
          <div className="col-span-2">
            <Controller
              name="horario"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  label="Horário"
                  options={[
                    { value: "17:00", label: "17:00" },
                    { value: "17:30", label: "17:30" },
                    { value: "18:00", label: "18:00" },
                    { value: "18:30", label: "18:30" },
                    { value: "19:00", label: "19:00" },
                  ]}
                  onKeyPress={preventEnterSubmit}
                />
              )}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-16">
        <div className="text-gradient font-bold text-lg">
          VALOR ESTIMADO: R$ 999,99
        </div>
        <div>
          <Button
            text="Voltar"
            className="mr-4 px-6 py-1"
            onClick={handlePrev}
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
          <Button
            text="Continuar"
            className="px-6 py-1"
            type="submit"
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
        </div>
      </div>
    </form>
  );
};

export default Step4;