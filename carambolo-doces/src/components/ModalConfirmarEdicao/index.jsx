import React from 'react';
import ModalBase from '../ModalBase';

export default function ModalConfirmarEdicao({ isOpen, onClose, onConfirm }) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="CONFIRMAR EDIÇÃO">
      <div className="flex flex-col items-center justify-between h-full">
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
            className="bg-green hover:bg-green text-white px-5 py-2 rounded-full font-semibold shadow"
          >
            Confirmar
          </button>
          <button
            onClick={onClose}
            className="bg-red hover:bg-red text-white px-5 py-2 rounded-full font-semibold shadow"
          >
            Cancelar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
