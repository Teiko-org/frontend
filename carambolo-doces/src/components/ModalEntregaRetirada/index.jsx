// ModalEntregaRetirada.jsx
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import CampoComGradiente from '../gradientField';
import Button from '../Button';
import ModalBaseForm from '../ModalBaseForm';
import PhoneNumberInput from '../PhoneInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

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
}) {
  const [telefone, setTelefone] = useState(selectedTelefone || '');
  const [data, setData] = useState(selectedData || null);
  const [nome, setNome] = useState(selectedNome || '');
  const [cep, setCep] = useState(selectedCep || '');
  const [uf, setUf] = useState(selectedUf || '');
  const [cidade, setCidade] = useState(selectedCidade || '');
  const [bairro, setBairro] = useState(selectedBairro || '');
  const [rua, setRua] = useState(selectedRua || '');
  const [numero, setNumero] = useState(selectedNumero || '');
  const [complemento, setComplemento] = useState(selectedComplemento || '');
  const [tipoEntrega, setTipoEntrega] = useState(selectedTipoEntrega || 'entrega');

  // Estado adicional para retirada
  const [localRetirada, setLocalRetirada] = useState('');
  const [horarioRetirada, setHorarioRetirada] = useState('');

  useEffect(() => {
    if (cep.length === 8) {
      buscarEnderecoPorCep(cep);
    }
  }, [cep]);

  const formatarCep = (valor) => {
    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length <= 5) {
      return cepLimpo;
    }
    return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5, 8)}`;
  };

  const buscarEnderecoPorCep = async (cepDigitado) => {
    try {
      const cepSomenteNumeros = cepDigitado.replace(/\D/g, '');

      if (cepSomenteNumeros.length !== 8) return;

      const response = await axios.get(`https://viacep.com.br/ws/${cepSomenteNumeros}/json/`);

      if (response.data && !response.data.erro) {
        setUf(response.data.uf || '');
        setCidade(response.data.localidade || '');
        setBairro(response.data.bairro || '');
        setRua(response.data.logradouro || '');
      } else {
        console.error('CEP não encontrado.');
        limparCamposEndereco();
      }
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
      limparCamposEndereco();
    }
  };

  const limparCamposEndereco = () => {
    setUf('');
    setCidade('');
    setBairro('');
    setRua('');
  };

  const handleCepChange = (e) => {
    const valorFormatado = formatarCep(e.target.value);
    setCep(valorFormatado);

    const cepSemMascara = valorFormatado.replace(/\D/g, '');

    if (cepSemMascara.length === 8) {
      buscarEnderecoPorCep(valorFormatado);
    } else {
      limparCamposEndereco();
    }
  };

  const handleSave = () => {
    const dados = {
      telefone,
      data,
      nome,
      tipoEntrega,
    };

    if (tipoEntrega === 'entrega') {
      dados.cep = cep;
      dados.uf = uf;
      dados.cidade = cidade;
      dados.bairro = bairro;
      dados.rua = rua;
      dados.numero = numero;
      dados.complemento = complemento;
    } else {
      dados.localRetirada = localRetirada;
      dados.horarioRetirada = horarioRetirada;
    }

    onSave(dados);
    onClose();
  };

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose} title="Escolha a Forma de Entrega">
      {/* ENTREGA OU RETIRADA */}
      <div className="mb-6 flex items-center text-[#103464]">
        <p className="text-base font-semibold whitespace-nowrap">Seu pedido será?</p>
        <div className="flex gap-6 ml-10">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="orderType"
              value="entrega"
              checked={tipoEntrega === 'entrega'}
              onChange={() => setTipoEntrega('entrega')}
              className="accent-[#caa77e]"
            />
            Entrega
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="orderType"
              value="retirada"
              checked={tipoEntrega === 'retirada'}
              onChange={() => setTipoEntrega('retirada')}
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
            <PhoneNumberInput value={telefone} onChange={setTelefone} />
          </CampoComGradiente>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Data</label>
          <CampoComGradiente>
            <div className="flex items-center px-2 py-1 bg-white rounded">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <DatePicker
                selected={data}
                onChange={(date) => setData(date)}
                dateFormat="dd/MM"
                placeholderText="DD/MM"
                showMonthDropdown
                showDayDropdown
                dropdownMode="select"
                className="w-full outline-none bg-transparent text-[#103464]"
              />
            </div>
          </CampoComGradiente>
        </div>
      </div>

      {/* CAMPOS DINÂMICOS */}
      {tipoEntrega === 'entrega' ? (
        <>
          {/* CAMPOS ENTREGA */}
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
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold mb-1">Local de Retirada</label>
            <CampoComGradiente>
              <input
                type="text"
                placeholder="Digite o local de retirada"
                value={localRetirada}
                onChange={(e) => setLocalRetirada(e.target.value)}
                className="w-full bg-white rounded px-2 py-1 outline-none"
              />
            </CampoComGradiente>
          </div>

          <div className="flex flex-col mb-6">
            <label className="text-sm font-semibold mb-1">Horário da Retirada</label>
            <CampoComGradiente>
              <input
                type="text"
                placeholder="Ex: 14:00 às 18:00"
                value={horarioRetirada}
                onChange={(e) => setHorarioRetirada(e.target.value)}
                className="w-full bg-white rounded px-2 py-1 outline-none"
              />
            </CampoComGradiente>
          </div>
        </>
      )}

      {/* BOTÃO FINAL */}
      <div className="flex justify-end mt-6">
        <Button text="Salvar" onClick={handleSave} />
      </div>
    </ModalBaseForm>
  );
}
