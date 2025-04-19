import React from 'react';
import ModalBaseForm from '../ModalBaseForm';
import { FaCalendarAlt } from 'react-icons/fa';

export default function ModalDadosEntrega({ isOpen, onClose }) {
  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold text-[#1d1d1d] mb-2">DADOS ENTREGA</h2>
      <div
        className="-mx-6 h-[2px] mb-4"
        style={{
          background: 'linear-gradient(0deg, #A47032 0%, #D4B076 100%)',
        }}
      ></div>

      {/* LINHA 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm font-semibold">Nome</label>
          <input className="w-full p-2 border rounded-md border-[#caa77e]" placeholder="Inserir seu nome" />
        </div>
        <div>
          <label className="text-sm font-semibold">Telefone</label>
          <input className="w-full p-2 border rounded-md border-[#caa77e]" placeholder="(XX) X XXXX-XXXX" />
        </div>
        <div>
          <label className="text-sm font-semibold">Data</label>
          <div className="flex items-center border rounded-md border-[#caa77e] p-2 bg-white">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <input className="w-full outline-none" placeholder="DD/MM" />
          </div>
        </div>
      </div>

      {/* LINHA 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <div>
          <label className="text-sm font-semibold">CEP</label>
          <input className="w-full p-2 border rounded-md border-[#caa77e]" placeholder="00000-000" />
        </div>
        <div>
          <label className="text-sm font-semibold">Estado</label>
          <select className="w-full p-2 border rounded-md border-[#caa77e] bg-white">
            <option>UF</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Cidade</label>
          <input className="w-full p-2 border rounded-md border-[#caa77e]" />
        </div>
        <div>
          <label className="text-sm font-semibold">Bairro</label>
          <input className="w-full p-2 border rounded-md border-[#caa77e]" />
        </div>
      </div>

      <div className="text-xs text-right text-blue-800 mb-4">
        Não sabe o CEP? <span className="underline cursor-pointer">Clique Aqui</span>
      </div>

      {/* LINHA 3 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-3">
          <label className="text-sm font-semibold">Rua</label>
          <input className="w-full p-2 border rounded-md border-[#caa77e]" placeholder="Inserir seu endereço" />
        </div>
        <div>
          <label className="text-sm font-semibold">Número</label>
          <input className="w-full p-2 border rounded-md border-[#caa77e]" />
        </div>
      </div>

      {/* LINHA 4 */}
      <div className="mb-6">
        <label className="text-sm font-semibold">Complemento</label>
        <input className="w-full p-2 border rounded-md border-[#caa77e]" />
      </div>

      {/* BOTÃO SALVAR */}
      <div className="flex justify-end">
        <button className="bg-[#b98a57] hover:bg-[#a87b4f] text-white px-6 py-1.5 rounded-full text-sm font-semibold">
          Salvar
        </button>
      </div>
    </ModalBaseForm>
  );
}
