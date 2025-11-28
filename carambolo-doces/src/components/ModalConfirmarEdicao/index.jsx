import React from 'react';
import ModalBase from '../ModalBase';

export default function ModalConfirmarEdicao({ isOpen, onClose, onConfirm, step }) {
  const isEncerramento = step && step.toLowerCase().includes('encerramento');
  const isCancelamento = step && step.toLowerCase().includes('cancelamento');
  const title = isEncerramento ? "CONFIRMAR ENCERRAMENTO" : isCancelamento ? "CONFIRMAR CANCELAMENTO" : "CONFIRMAR EDIÇÃO";

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title}>
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
          {isEncerramento ? (
            "Tem certeza que deseja encerrar a fornada?"
          ) : isCancelamento ? (
            "Tem certeza que deseja cancelar a edição? Todas as alterações não salvas serão perdidas."
          ) : (
            <>
              Tem certeza que deseja editar os dados da fase de <span style={{ fontWeight: 600 }}>{step}</span>?
            </>
          )}
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
