import React, { useState } from 'react';
import ModalBaseForm from '../ModalBaseForm';

export default function ModalAdicionais({ isOpen, onClose }) {
  const [adicionais, setAdicionais] = useState({
    cereja: true,
    glitter: true,
    perolado: true,
    lacinhos: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAdicionais((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold text-[#103464] mb-2">ADICIONAIS</h2>
      <div
        className="-mx-6 h-[2px] mb-4"
        style={{
          background: 'linear-gradient(0deg, #A47032 0%, #D4B076 100%)',
        }}
      ></div>

      <div className="flex flex-wrap gap-6 mb-4">
        {[
          { label: 'CEREJA', name: 'cereja' },
          { label: 'GLITTER', name: 'glitter' },
          { label: 'PEROLADO', name: 'perolado' },
          { label: 'LACINHOS', name: 'lacinhos' },
        ].map((item) => (
          <label
            key={item.name}
            className="flex items-center gap-2 text-[#1d1d1d] text-sm font-semibold cursor-pointer"
          >
            <input
              type="checkbox"
              name={item.name}
              checked={adicionais[item.name]}
              onChange={handleCheckboxChange}
              className="sr-only"
            />
            <span
              className="w-5 h-5 rounded-sm p-[1px]"
              style={{
                background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                className="w-full h-full rounded-[1px] flex items-center justify-center"
                style={{
                  background: adicionais[item.name]
                    ? 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)'
                    : '#fff',
                  transition: 'all 0.2s ease',
                }}
              >
                {adicionais[item.name] && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </span>
            {item.label}
          </label>
        ))}
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
