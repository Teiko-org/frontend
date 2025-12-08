import React, { useState, useEffect } from "react";
import CampoComGradiente from "../gradientField";
import Button from "../Button";
import ModalBaseForm from "../ModalBaseForm";
import PhoneInputCustom from "../PhoneInput/PhoneInputCustom";
import ModalConfirmarEdicao from "../ModalConfirmarEdicao";
import CustomDatePicker from "../DatePicker";
import Select from "../Select";
import axios from "axios";
import { listUserAddresses } from "../../service/addressService";

export default function ModalEntregaRetirada({
  isOpen,
  onClose,
  onSave,
  selectedData,
  selectedTelefone,
  selectedNome,
  selectedCep,
  selectedUf,
  selectedCidade,
  selectedBairro,
  selectedRua,
  selectedNumero,
  selectedComplemento,
  selectedTipoEntrega,
  selectedHorario,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const [telefone, setTelefone] = useState(selectedTelefone || "");
  const [data, setData] = useState(selectedData || "");
  const [nome, setNome] = useState(selectedNome || "");
  const [cep, setCep] = useState(selectedCep || "");
  const [uf, setUf] = useState(selectedUf || "");
  const [cidade, setCidade] = useState(selectedCidade || "");
  const [bairro, setBairro] = useState(selectedBairro || "");
  const [rua, setRua] = useState(selectedRua || "");
  const [numero, setNumero] = useState(selectedNumero || "");
  const [complemento, setComplemento] = useState(selectedComplemento || "");
  const [tipoEntrega, setTipoEntrega] = useState(
    selectedTipoEntrega?.toLowerCase() || "entrega"
  );

  const [horarioRetirada, setHorarioRetirada] = useState("");
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
    if (isOpen && tipoEntrega === "entrega") {
      loadAddresses();
    }
  }, [isOpen, isSignedIn, tipoEntrega]);

  const convertDateToString = (dateValue) => {
    if (!dateValue) return "";
    
    if (typeof dateValue === 'string') {
      // Se já é string, pode estar em formato DD/MM ou DD/MM/YYYY
      // O CustomDatePicker espera YYYY/MM/DD ou pode converter de DD/MM
      const parts = dateValue.split('/');
      if (parts.length === 2 || (parts.length === 3 && parts[0].length === 2)) {
        // Formato DD/MM ou DD/MM/YYYY - converter para YYYY/MM/DD
        if (parts.length === 2) {
          const day = parts[0];
          const month = parts[1];
          const year = new Date().getFullYear();
          return `${year}/${month}/${day}`;
        } else {
          const day = parts[0];
          const month = parts[1];
          const year = parts[2];
          return `${year}/${month}/${day}`;
        }
      }
      // Se já está em formato YYYY/MM/DD, retornar como está
      return dateValue;
    }
    
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      // Converter Date para formato YYYY/MM/DD (formato do CustomDatePicker)
      const year = dateValue.getFullYear();
      const month = String(dateValue.getMonth() + 1).padStart(2, '0');
      const day = String(dateValue.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    }
    
    return "";
  };

  useEffect(() => {
    if (isOpen) {
      setTelefone(selectedTelefone || "");
      setData(convertDateToString(selectedData));
      setNome(selectedNome || "");
      setCep(selectedCep || "");
      setUf(selectedUf || "");
      setCidade(selectedCidade || "");
      setBairro(selectedBairro || "");
      setRua(selectedRua || "");
      setNumero(selectedNumero || "");
      setComplemento(selectedComplemento || "");
      setTipoEntrega(selectedTipoEntrega?.toLowerCase() || "entrega");
      setHorarioRetirada(selectedHorario || "");
      setSelectedAddressId("");
    }
  }, [isOpen, selectedTelefone, selectedData, selectedNome, selectedCep, selectedUf, selectedCidade, selectedBairro, selectedRua, selectedNumero, selectedComplemento, selectedTipoEntrega, selectedHorario]);

  useEffect(() => {
    if (tipoEntrega === "entrega") {
      setHorarioRetirada("");
    } else if (tipoEntrega === "retirada") {
      setCep("");
      setUf("");
      setCidade("");
      setBairro("");
      setRua("");
      setNumero("");
      setComplemento("");
      setSelectedAddressId("");
    }
  }, [tipoEntrega]);

  useEffect(() => {
    const cepSemMascara = cep.replace(/\D/g, "");
    if (cepSemMascara.length === 8) {
      buscarEnderecoPorCep(cep);
    }
  }, [cep]);

  const formatarCep = (valor) => {
    const cepLimpo = valor.replace(/\D/g, "");
    if (cepLimpo.length <= 5) {
      return cepLimpo;
    }
    return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5, 8)}`;
  };

  const buscarEnderecoPorCep = async (cepDigitado) => {
    try {
      const cepSomenteNumeros = cepDigitado.replace(/\D/g, "");

      if (cepSomenteNumeros.length !== 8) return;

      const response = await axios.get(
        `https://viacep.com.br/ws/${cepSomenteNumeros}/json/`
      );

      if (response.data && !response.data.erro) {
        setUf(response.data.uf || "");
        setCidade(response.data.localidade || "");
        setBairro(response.data.bairro || "");
        setRua(response.data.logradouro || "");
      } else {
        console.error("CEP não encontrado.");
        limparCamposEndereco();
      }
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
      limparCamposEndereco();
    }
  };

  const limparCamposEndereco = () => {
    setUf("");
    setCidade("");
    setBairro("");
    setRua("");
  };

  const handleCepChange = (e) => {
    const valorFormatado = formatarCep(e.target.value);
    setCep(valorFormatado);

    const cepSemMascara = valorFormatado.replace(/\D/g, "");

    if (cepSemMascara.length === 8) {
      buscarEnderecoPorCep(valorFormatado);
    } else {
      limparCamposEndereco();
    }
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    if (!addressId || addressId === "") return;

    if (addressId === "novo") {
      setCep("");
      setCidade("");
      setBairro("");
      setRua("");
      setNumero("");
      setComplemento("");
      return;
    }

    const selected = userAddresses.find((addr) => addr.id === parseInt(addressId));
    if (selected) {
      setCep(selected.cep || "");
      setCidade(selected.cidade || "");
      setBairro(selected.bairro || "");
      setRua(selected.logradouro || "");
      setNumero(selected.numero || "");
      setComplemento(selected.complemento || "");
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    // Se for formato YYYY/MM/DD (do CustomDatePicker), converter para DD/MM/YYYY
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3 && parts[0].length === 4) {
        // Formato YYYY/MM/DD
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      } else if (parts.length === 2 || (parts.length === 3 && parts[0].length === 2)) {
        // Formato DD/MM ou DD/MM/YYYY
        return dateString;
      }
    }
    
    return dateString;
  };

  const handleSave = () => {
    const dados = {
      telefone,
      data: formatDateForDisplay(data),
      nome,
      deliveryOption: tipoEntrega === "entrega" ? "Entrega" : "Retirada",
    };

    if (tipoEntrega === "entrega") {
      dados.cep = cep;
      dados.estado = uf;
      dados.cidade = cidade;
      dados.bairro = bairro;
      dados.rua = rua;
      dados.numero = numero;
      dados.complemento = complemento;
    } else {
      dados.horario = horarioRetirada;
    }

    if (onSave) {
      onSave(dados);
    }
    setIsModalOpen(true);
  };

  return (
    <ModalBaseForm
      isOpen={isOpen}
      onClose={onClose}
      title="Escolha a Forma de Entrega"
    >
      {/* ENTREGA OU RETIRADA */}
      <div className="mb-6 flex items-center text-[#103464]">
        <p className="text-base font-semibold whitespace-nowrap">
          Seu pedido será?
        </p>
        <div className="flex gap-6 ml-10">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="orderType"
              value="entrega"
              checked={tipoEntrega === "entrega"}
              onChange={() => setTipoEntrega("entrega")}
              className="accent-[#caa77e]"
            />
            Entrega
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="orderType"
              value="retirada"
              checked={tipoEntrega === "retirada"}
              onChange={() => setTipoEntrega("retirada")}
              className="accent-[#caa77e]"
            />
            Retirada
          </label>
        </div>
      </div>

      {/* CAMPOS COMUNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Nome</label>
          <CampoComGradiente>
            <input
              type="text"
              placeholder="Inserir seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-white rounded px-2 py-1 outline-none"
            />
          </CampoComGradiente>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Telefone</label>
          <CampoComGradiente>
            <PhoneInputCustom value={telefone} onChange={setTelefone} includeCountryCode={true} />
          </CampoComGradiente>
        </div>

        <div className="flex flex-col">
          <CustomDatePicker
            label="Data"
            placeholder="DD/MM"
            value={data}
            onChange={(dateString) => setData(dateString)}
          />
        </div>
      </div>

      {/* CAMPOS DINÂMICOS */}
      {tipoEntrega === "entrega" ? (
        <>
          {/* CAMPOS ENTREGA */}
          {isSignedIn && userAddresses.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-semibold mb-1 block">Endereço salvo</label>
              <CampoComGradiente>
                <select
                  value={selectedAddressId}
                  onChange={(e) => handleAddressSelection(e.target.value)}
                  className="w-full bg-white rounded px-2 py-1 outline-none"
                >
                  <option value="">Selecione um endereço</option>
                  {userAddresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.nome} - {address.logradouro}, {address.numero} - {address.bairro}
                    </option>
                  ))}
                  <option value="novo">Usar novo endereço</option>
                </select>
              </CampoComGradiente>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">CEP</label>
              <CampoComGradiente>
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={handleCepChange}
                  maxLength={9}
                  className="w-full bg-white rounded px-2 py-1 outline-none"
                />
              </CampoComGradiente>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Estado</label>
              <CampoComGradiente>
                <select
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  className="w-full bg-white rounded px-2 py-1 outline-none"
                >
                  <option value="">UF</option>
                  <option value="SP">SP</option>
                  {/* Pode adicionar mais opções */}
                </select>
              </CampoComGradiente>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Cidade</label>
              <CampoComGradiente>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full bg-white rounded px-2 py-1 outline-none"
                />
              </CampoComGradiente>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Bairro</label>
              <CampoComGradiente>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full bg-white rounded px-2 py-1 outline-none"
                />
              </CampoComGradiente>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-3 flex flex-col">
              <label className="text-sm font-semibold mb-1">Rua</label>
              <CampoComGradiente>
                <input
                  type="text"
                  placeholder="Inserir seu endereço"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  className="w-full bg-white rounded px-2 py-1 outline-none"
                />
              </CampoComGradiente>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Número</label>
              <CampoComGradiente>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full bg-white rounded px-2 py-1 outline-none"
                />
              </CampoComGradiente>
            </div>
          </div>

          <div className="flex flex-col mb-6">
            <label className="text-sm font-semibold mb-1">Complemento</label>
            <div className="w-1/2">
              <CampoComGradiente>
                <input
                  type="text"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  className="w-full bg-white rounded px-2 py-1 outline-none"
                />
              </CampoComGradiente>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* CAMPOS RETIRADA */}
          <div className="flex flex-col mb-6 w-full">
            <Select
              label="Horário da Retirada"
              options={[
                { value: "17:00", label: "17:00" },
                { value: "17:30", label: "17:30" },
                { value: "18:00", label: "18:00" },
                { value: "18:30", label: "18:30" },
                { value: "19:00", label: "19:00" },
              ]}
              placeholder="Selecione seu horário"
              value={horarioRetirada || ""}
              onChange={(e) => setHorarioRetirada(e.target.value)}
            />
          </div>
        </>
      )}

      {/* BOTÃO FINAL */}
      <div className="flex justify-end mt-6">
        <Button text="Salvar" onClick={handleSave} />
      </div>
      {isModalOpen && <ModalConfirmarEdicao onClose={closeModal} step={"Entrega"} />}
    </ModalBaseForm>
  );
}
