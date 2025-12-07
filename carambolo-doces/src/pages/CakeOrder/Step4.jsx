import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "../../contexts/FormContext";
import { useFormContext, Controller } from "react-hook-form";
import Button from "../../components/Button";
import Select from "../../components/Select";
import InputOption from "../../components/InputOption";
import CustomDatePicker from "../../components/DatePicker";
import PhoneInputCustom from "../../components/PhoneInput/PhoneInputCustom";
import { validateBrazilianPhone } from "../../utils/phoneValidation";
import CampoComGradiente from "../../components/gradientField";
import { searchAddressByCep } from "../../service/viaCepService";
import { listUserAddresses } from "../../service/addressService";

const Step4 = () => {
  const { nextStep, prevStep, appendFormData, valorEstimado } = useContext(FormContext);
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext();

  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const isSignedIn = !!localStorage.getItem("IS_SIGNED");

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (isSignedIn && userId) {
          const addresses = await listUserAddresses(userId);
          setUserAddresses(addresses || []);
        }
      } catch (_) {
        setUserAddresses([]);
      }
    };
    loadAddresses();
  }, [isSignedIn]);

  const onSubmit = (data) => {
    const plainData = {
      nome: data.nome,
      telefone: data.telefone,
      data: data.data,
      deliveryOption: data.deliveryOption,
      cep: data.cep,
      estado: data.estado,
      cidade: data.cidade,
      bairro: data.bairro,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
      horario: data.horario,
    };

    appendFormData(plainData, "dadosEntrega");
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const cep = watch("cep", "");
  const deliveryOption = watch("deliveryOption", "Entrega");

  useEffect(() => {
    if (deliveryOption === "Entrega") {
      setValue("horario", "");
    } else if (deliveryOption === "Retirada") {
      setValue("cep", "");
      setValue("estado", "");
      setValue("cidade", "");
      setValue("bairro", "");
      setValue("rua", "");
      setValue("numero", "");
      setValue("complemento", "");
      setSelectedAddressId("");
    }
    setValue("estado", "SP");
  }, [deliveryOption, setValue]);

  useEffect(() => {
    if (cep.replace("-", "").length === 8) {
      fetchAddressByCep(cep);
    }
  }, [cep]);

  const handleCepChange = (value) => {
    const formattedValue = formatCep(value);
    setValue("cep", formattedValue);
    clearErrors("cep");

    if (formattedValue.replace("-", "").length === 8) {
      fetchAddressByCep(formattedValue);
    } else {
      cleanAddressFields();
    }
  };

  const fetchAddressByCep = async (typedCep) => {
    await searchAddressByCep(
      typedCep.replace("-", ""),
      () => {
        setValue("estado", "SP");
      },
      (val) => {
        setValue("cidade", val);
        clearErrors("cidade");
      },
      (val) => {
        setValue("bairro", val);
        clearErrors("bairro");
      },
      (val) => {
        setValue("rua", val);
        clearErrors("rua");
      },
      cleanAddressFields
    );
  };

  const cleanAddressFields = () => {
    setValue("cidade", "");
    setValue("bairro", "");
    setValue("rua", "");
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    if (!addressId) return;

    if (addressId === "novo") {
      setValue("cep", "");
      setValue("cidade", "");
      setValue("bairro", "");
      setValue("rua", "");
      setValue("numero", "");
      setValue("complemento", "");
      return;
    }

    const selected = userAddresses.find((addr) => addr.id === parseInt(addressId));
    if (selected) {
      setValue("cep", selected.cep || "");
      setValue("cidade", selected.cidade || "");
      setValue("bairro", selected.bairro || "");
      setValue("rua", selected.logradouro || "");
      setValue("numero", selected.numero || "");
      setValue("complemento", selected.complemento || "");
      clearErrors("cep");
      clearErrors("cidade");
      clearErrors("bairro");
      clearErrors("rua");
      clearErrors("numero");
    }
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
                    setValue("horario", "");
                    clearErrors("deliveryOption");
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
            rules={{ required: "Nome é obrigatório" }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Inserir o seu nome"
                className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                onChange={(e) => {
                  field.onChange(e);
                  clearErrors("nome");
                }}
                onKeyPress={preventEnterSubmit}
              />
            )}
          />
          <div style={{ height: "14px" }}>
            {errors.nome && (
              <span className="text-red text-xs">{errors.nome.message}</span>
            )}
          </div>
        </div>
        <div className="col-span-4">
          <label className="block text-blue font-semibold mb-1">Telefone</label>
          <CampoComGradiente>
            <Controller
              name="telefone"
              control={control}
              defaultValue=""
              rules={{ 
                required: "Telefone é obrigatório",
                validate: (value) => {
                  const validation = validateBrazilianPhone(value, { allowCountryCode: true, requireMobile: false });
                  return validation.valid || validation.error || "Telefone inválido";
                }
              }}
              render={({ field }) => (
                <PhoneInputCustom
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors("telefone");
                  }}
                  includeCountryCode={true}
                />
              )}
            />
          </CampoComGradiente>
          <div style={{ height: "14px" }}>
            {errors.telefone && (
              <span className="text-red text-xs">
                {errors.telefone.message}
              </span>
            )}
          </div>
        </div>
        <div className="col-span-2">
          <Controller
            name="data"
            control={control}
            defaultValue={null}
            rules={{ required: "Data é obrigatória" }}
            render={({ field }) => (
              <CustomDatePicker
                value={field.value}
                onChange={(date) => {
                  field.onChange(date);
                  clearErrors("data");
                }}
                label="Data"
                placeholder="DD/MM"
                onKeyPress={preventEnterSubmit}
              />
            )}
          />
          <div style={{ height: "14px" }}>
            {errors.data && (
              <span className="text-red text-xs">{errors.data.message}</span>
            )}
          </div>
        </div>

        {deliveryOption === "Entrega" && (
          <>
            {isSignedIn && userAddresses.length > 0 && (
              <div className="col-span-12">
                <label className="block text-blue font-semibold mb-1">Endereço salvo</label>
                <select
                  value={selectedAddressId}
                  onChange={(e) => handleAddressSelection(e.target.value)}
                  className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                >
                  <option value="">Selecione um endereço</option>
                  {userAddresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.nome} - {address.logradouro}, {address.numero} - {address.bairro}
                    </option>
                  ))}
                  <option value="novo">Usar novo endereço</option>
                </select>
              </div>
            )}

            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">CEP</label>
              <Controller
                name="cep"
                control={control}
                defaultValue=""
                rules={{ required: "CEP é obrigatório" }}
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
              <div style={{ height: "14px" }}>
                {errors.cep && (
                  <span className="text-red text-xs">{errors.cep.message}</span>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <Controller
                name="estado"
                control={control}
                defaultValue="SP"
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
                rules={{ required: "Cidade é obrigatória" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("cidade");
                    }}
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
              <div style={{ height: "14px" }}>
                {errors.cidade && (
                  <span className="text-red text-xs">
                    {errors.cidade.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">
                Bairro
              </label>
              <Controller
                name="bairro"
                control={control}
                defaultValue=""
                rules={{ required: "Bairro é obrigatório" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("bairro");
                    }}
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
              <div style={{ height: "14px" }}>
                {errors.bairro && (
                  <span className="text-red text-xs">
                    {errors.bairro.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-8">
              <label className="block text-blue font-semibold mb-1">
                Endereço
              </label>
              <Controller
                name="rua"
                control={control}
                defaultValue=""
                rules={{ required: "Endereço é obrigatório" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("rua");
                    }}
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
              <div style={{ height: "14px" }}>
                {errors.rua && (
                  <span className="text-red text-xs">{errors.rua.message}</span>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <label className="block text-blue font-semibold mb-1">
                Número
              </label>
              <Controller
                name="numero"
                control={control}
                defaultValue=""
                rules={{ required: "Número é obrigatório" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                    onChange={(e) => {
                      // Permitir apenas dígitos no número
                      const onlyDigits = e.target.value.replace(/\D/g, "");
                      field.onChange(onlyDigits);
                      clearErrors("numero");
                    }}
                    onKeyPress={preventEnterSubmit}
                  />
                )}
              />
              <div style={{ height: "14px" }}>
                {errors.numero && (
                  <span className="text-red text-xs">
                    {errors.numero.message}
                  </span>
                )}
              </div>
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
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("complemento");
                    }}
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
              rules={{ required: "Horário é obrigatório" }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Horário"
                  placeholder="Selecione seu horário"
                  options={[
                    { value: "17:00", label: "17:00" },
                    { value: "17:30", label: "17:30" },
                    { value: "18:00", label: "18:00" },
                    { value: "18:30", label: "18:30" },
                    { value: "19:00", label: "19:00" },
                  ]}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors("horario");
                  }}
                  onKeyPress={preventEnterSubmit}
                />
              )}
            />
            <div style={{ height: "14px" }}>
              {errors.horario && (
                <span className="text-red text-xs">
                  {errors.horario.message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-gradient font-bold text-lg">
          VALOR ESTIMADO: R$ {valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
