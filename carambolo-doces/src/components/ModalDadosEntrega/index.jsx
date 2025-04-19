import React from 'react';
import ModalBaseForm from '../ModalBaseForm';
import { FaCalendarAlt } from 'react-icons/fa';

export default function ModalDadosEntrega({ isOpen, onClose }) {
  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose}>
      {/* TÍTULO */}
      <h2 className="text-lg font-bold text-[#103464] mb-2">DADOS ENTREGA</h2>
      <div
        className="-mx-6 h-[2px] mb-4"
        style={{
          background: 'linear-gradient(0deg, #A47032 0%, #D4B076 100%)',
        }}
      ></div>

      {/* LINHA 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-[#103464]">
        {['Nome', 'Telefone', 'Data'].map((label, i) => (
          <div key={i} className="flex flex-col">
            <label className="text-sm font-semibold mb-1">{label}</label>
            {label === 'Data' ? (
              <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
                <div className="flex items-center px-2 py-1 bg-white rounded">
                  <FaCalendarAlt className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="DD/MM"
                    className="w-full outline-none text-[#103464] bg-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
                <input
                  type="text"
                  placeholder={label === 'Telefone' ? '(XX) X XXXX-XXXX' : 'Inserir seu nome'}
                  className="w-full bg-white rounded px-2 py-1 outline-none text-[#103464]"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* LINHA 2 */}
      {/* LINHA 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-[#103464]">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">CEP</label>
          <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
            <input
              type="text"
              placeholder="00000-000"
              className="w-full bg-white rounded px-2 py-1 outline-none text-[#103464]"
            />
          </div>
          <span className="text-xs text-blue-800 mt-1">
            Não sabe o CEP? <span className="underline cursor-pointer">Clique Aqui</span>
          </span>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Estado</label>
          <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
            <select className="w-full bg-white rounded px-2 py-1 outline-none text-[#103464]">
              <option>UF</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Cidade</label>
          <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
            <input
              type="text"
              className="w-full bg-white rounded px-2 py-1 outline-none text-[#103464]"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Bairro</label>
          <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
            <input
              type="text"
              className="w-full bg-white rounded px-2 py-1 outline-none text-[#103464]"
            />
          </div>
        </div>
      </div>

      {/* LINHA 3 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-[#103464]">
        <div className="md:col-span-3 flex flex-col">
          <label className="text-sm font-semibold mb-1">Rua</label>
          <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
            <input
              type="text"
              placeholder="Inserir seu endereço"
              className="w-full bg-white rounded px-2 py-1 outline-none text-[#103464]"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Número</label>
          <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
            <input
              type="text"
              className="w-full bg-white rounded px-2 py-1 outline-none text-[#103464]"
            />
          </div>
        </div>
      </div>

      {/* LINHA 4 */}
      <div className="mb-6 text-[#103464]">
        <label className="text-sm font-semibold mb-1 block">Complemento</label>
        <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
          <input
            type="text"
            className="w-full bg-white rounded px-2 py-1 outline-none text-[#103464]"
          />
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
