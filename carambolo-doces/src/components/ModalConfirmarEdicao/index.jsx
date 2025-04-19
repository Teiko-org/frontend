import React from 'react';

export default function ModalConfirmarEdicao({ isOpen, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="p-[2px] rounded-xl"
        style={{
          background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)',
          width: '689px',
          height: '271px',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="rounded-xl text-white shadow-lg p-6 relative w-full h-full flex flex-col items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, #103464 0%, #30344F 100%)',
          }}
        >
          {/* Botão Fechar com Gradiente */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl font-bold hover:scale-105"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>

          {/* Título com Gradiente */}
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
          <div className="flex justify-center gap-4">
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
      </div>
    </div>
  );
}
