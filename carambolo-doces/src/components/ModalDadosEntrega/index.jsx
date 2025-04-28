import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import CampoComGradiente from '../gradientField';
import Button from '../Button';
import ModalBaseForm from '../ModalBaseForm';
import PhoneNumberInput from '../PhoneInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useEffect } from 'react';

export default function ModalDeliveryData({
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
  const [tipoEntrega, setTipoEntrega] = useState(selectedTipoEntrega || 'retirada');

  useEffect(() => {
    if (cep.length === 8) {
      buscarEnderecoPorCep(cep);
    }
  }, [cep]);

  const handleSave = () => {
    onSave({
      telefone,
      data,
      nome,
      cep,
      uf,
      cidade,
      bairro,
      rua,
      numero,
      complemento,
      tipoEntrega,
    });
    onClose();
  };

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

      if (cepSomenteNumeros.length !== 8) {
        return;
      }

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

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose} title="DADOS ENTREGA">
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

      {/* LINHA 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Nome */}
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

        {/* Telefone */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Telefone</label>
          <CampoComGradiente>
            <PhoneNumberInput value={telefone} onChange={setTelefone} />
          </CampoComGradiente>
        </div>

        {/* Data */}
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

      {/* LINHA 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* CEP */}
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
          <span className="text-xs text-blue-800 mt-1">
            Não sabe o CEP? <span className="underline cursor-pointer">Clique Aqui</span>
          </span>
        </div>

        {/* Estado */}
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
              {/* Add as opções que quiser */}
            </select>
          </CampoComGradiente>
        </div>

        {/* Cidade */}
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

        {/* Bairro */}
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

      {/* LINHA 3 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Rua */}
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

        {/* Número */}
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

      {/* LINHA 4 */}
      <div className="mb-6">
        <label className="text-sm font-semibold mb-1 block">Complemento</label>
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

      {/* BOTÃO */}
      <div className="flex justify-end mt-6">
        <Button
          text="Salvar"
          onClick={handleSave}
          bgColor="bg-gradient-to-l from-gold to-darkGold"
          fontSize="text-sm"
          textColor="text-blue"
          borderColor="border-gold"
        />
      </div>
    </ModalBaseForm>
  );
}
