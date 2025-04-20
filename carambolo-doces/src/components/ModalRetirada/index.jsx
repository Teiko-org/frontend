import React, { useState } from 'react';
import ModalBaseForm from '../ModalBaseForm';
import CampoComGradiente from '../gradientField';
import Button from '../Button';
import PhoneNumberInput from '../PhoneInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

export default function ModalRetirada({ isOpen, onClose }) {
  const [orderType, setOrderType] = useState('retirada');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSave = () => {
    const data = {
      orderType,
      name,
      phone,
      date,
      time,
    };
    console.log('Retirada data:', data);
    onClose(); 
  };

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose} title="DADOS RETIRADA">
      {/* PERGUNTA E RADIO */}
      <div className="mb-4 flex items-center text-[#103464]">
        <p className="text-base font-semibold whitespace-nowrap">Seu pedido será?</p>
        <div className="flex gap-6 ml-10">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="tipo"
              value="entrega"
              checked={orderType === 'entrega'}
              onChange={(e) => setOrderType(e.target.value)}
              className="accent-[#caa77e]"
            />
            Entrega
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="tipo"
              value="retirada"
              checked={orderType === 'retirada'}
              onChange={(e) => setOrderType(e.target.value)}
              className="accent-[#caa77e]"
            />
            Retirada
          </label>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-[#103464]">
        <div className="flex flex-col col-span-1">
          <label className="text-sm font-semibold mb-1">Nome</label>
          <CampoComGradiente>
            <input
              type="text"
              placeholder="Inserir seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white rounded px-2 py-1 outline-none text-[#103464]"
            />
          </CampoComGradiente>
        </div>

        {/* Telefone */}
        <div className="flex flex-col mb-4">
          <label className="text-sm font-semibold mb-1">Telefone</label>
          <CampoComGradiente>
            <PhoneNumberInput value={phone} onChange={setPhone} />
          </CampoComGradiente>
        </div>


        <div className="flex flex-col col-span-1">
          <label className="text-sm font-semibold mb-1">Data</label>
          <CampoComGradiente>
            <div className="flex items-center px-2 py-1 bg-white rounded">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
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

      {/* HORÁRIO */}
      <div className="mb-6 text-[#103464]">
        <label className="text-sm font-semibold mb-1 block">Horário</label>
        <div className="p-[1px] w-fit rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-white rounded px-2 py-1 w-138 text-[#103464] outline-none"
          >
            <option value=""></option>
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
          </select>
        </div>
      </div>

      {/* BOTÃO SALVAR */}
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
