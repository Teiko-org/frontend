import React from 'react';
import ModalBaseForm from '../ModalBaseForm';

export default function ModalRetirada({ isOpen, onClose }) {
  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose}>
      {/* TÍTULO */}
      <h2 className="text-lg font-bold text-[#103464] mb-2">DADOS RETIRADA</h2>
      <div
        className="-mx-6 h-[2px] mb-4"
        style={{
          background: 'linear-gradient(0deg, #A47032 0%, #D4B076 100%)',
        }}
      ></div>

      {/* PERGUNTA E RADIO */}
      <div className="mb-4">
        <p className="text-base font-semibold text-[#103464] mb-2">Seu pedido será?</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-[#103464]">
            <input type="radio" name="tipo" value="entrega" className="accent-[#caa77e]" />
            Entrega
          </label>
          <label className="flex items-center gap-2 text-sm text-[#103464]">
            <input type="radio" name="tipo" value="retirada" className="accent-[#caa77e]" defaultChecked />
            Retirada
          </label>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-[#103464]">
        {['Nome', 'Telefone', 'Data'].map((label, i) => (
          <div key={i} className="flex flex-col col-span-1">
            <label className="text-sm font-semibold mb-1">{label}</label>
            <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
              <input
                type="text"
                placeholder={label === 'Data' ? 'DD/MM' : `Inserir seu ${label.toLowerCase()}`}
                className="w-full bg-white rounded px-2 py-1 outline-none text-[#103464]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* HORÁRIO */}
      <div className="mb-6 text-[#103464]">
        <label className="text-sm font-semibold mb-1 block">Horário</label>
        <div className="p-[1px] w-fit rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
          <select className="bg-white rounded px-2 py-1 w-32 text-[#103464] outline-none">
            <option value="">Selecione</option>
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
          </select>
        </div>
      </div>

      {/* BOTÃO SALVAR */}
      <div className="flex justify-end">
        <button className="botao-gradiente botao-azul selecionado text-sm font-semibold px-6 py-1.5">
          Salvar
        </button>
      </div>
    </ModalBaseForm>
  );
}
