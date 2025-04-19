import React from 'react';
import ModalBaseForm from '../ModalBaseForm';

export default function ModalRetirada({ isOpen, onClose }) {
  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold text-[#1d1d1d] mb-2">DADOS RETIRADA</h2>
      <div className="border-b border-[#caa77e] mb-4"></div>

      {/* ENTREGA OU RETIRADA */}
      <div className="flex gap-6 mb-4">
        <label className="flex items-center gap-2 text-sm text-[#1d1d1d]">
          <input type="radio" name="tipo" value="entrega" className="accent-[#caa77e]" />
          Entrega
        </label>
        <label className="flex items-center gap-2 text-sm text-[#1d1d1d]">
          <input type="radio" name="tipo" value="retirada" className="accent-[#caa77e]" defaultChecked />
          Retirada
        </label>
      </div>

      {/* FORM CAMPOS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#1d1d1d] mb-1">DATA</label>
          <input
            type="text"
            placeholder="DD/MM"
            className="border border-[#caa77e] rounded px-2 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#1d1d1d] mb-1">HORÁRIO</label>
          <select className="border border-[#caa77e] rounded px-2 py-1">
            <option value="">Selecione</option>
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#1d1d1d] mb-1">NOME</label>
          <input
            type="text"
            placeholder="Inserir seu nome"
            className="border border-[#caa77e] rounded px-2 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#1d1d1d] mb-1">TELEFONE</label>
          <input
            type="text"
            placeholder="(XX) X XXXX-XXXX"
            className="border border-[#caa77e] rounded px-2 py-1"
          />
        </div>
      </div>

      {/* BOTÃO SALVAR */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-[#a67847] to-[#caa77e] text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-sm hover:brightness-90">
          Salvar
        </button>
      </div>
    </ModalBaseForm>
  );
}
