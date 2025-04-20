import React from 'react';
import ModalBase from '../ModalBase';

export default function ModalConfirmarEdicao({ isOpen, onClose, onConfirm }) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-between h-full">
        <h2
          className="font-semibold text-[36px] leading-normal text-center"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CONFIRMAR EDIÇÃO
        </h2>

        {/* Texto com Montserrat, 400, 24px */}
        <p
          className="text-center my-2"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 400,
            fontSize: '24px',
            color: 'white',
          }}
        >
          Tem certeza que deseja editar a fase de <span style={{ fontWeight: 600 }}>Montagem</span>?
        </p>

        {/* Botões */}
        <div className="flex justify-center gap-8">
          <button
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold shadow"
          >
            Confirmar
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold shadow"
          >
            Cancelar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
