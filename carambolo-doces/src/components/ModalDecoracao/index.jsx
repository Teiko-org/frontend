import React from 'react';
import ModalBaseForm from '../ModalBaseForm';
import { FaFileAlt } from 'react-icons/fa';

export default function ModalDecoracao({ isOpen, onClose }) {
  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold text-[#103464] mb-2">DECORAÇÃO</h2>
      <div
        className="-mx-6 h-[2px] mb-4"
        style={{
          background: 'linear-gradient(0deg, #A47032 0%, #D4B076 100%)',
        }}
      ></div>

      {/* REFERÊNCIAS */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#103464] mb-1">REFERÊNCIAS</h3>
        <div className="w-[500px] h-[150px] flex items-center justify-start gap-4 px-4 py-3 bg-white rounded-lg border-gradient">
          {[...Array(5)].map((_, i) => (
            <FaFileAlt key={i} className="text-3xl text-[#103464]" />
          ))}
        </div>
      </div>


      {/* OBSERVAÇÕES */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#103464] mb-1">OBSERVAÇÕES</h3>
        <textarea
          className="w-full h-28 border rounded-lg p-2 resize-none border-gradient"
          placeholder="Descreva abaixo como você quer o seu Carambolo"
        />
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
