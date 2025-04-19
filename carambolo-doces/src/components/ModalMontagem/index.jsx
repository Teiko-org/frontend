import React, { useState } from 'react';
import ModalBaseForm from '../ModalBaseForm';
import './modalMontagem.css';

export default function ModalMontagem({ isOpen, onClose }) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('13cm');
  const [formatoSelecionado, setFormatoSelecionado] = useState('Redondo');

  const tamanhos = ['11cm', '13cm', '15cm', '17cm'];
  const formatos = ['Redondo', 'Coração'];

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold text-[#103464] mb-2">MONTAGEM</h2>
      <div
        className="-mx-6 h-[2px] mb-4"
        style={{
          background: 'linear-gradient(0deg, #A47032 0%, #D4B076 100%)',
        }}
      ></div>

      {/* TAMANHO */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#103464] mb-2">
          TAMANHO <span className="text-blue-700 text-xs cursor-pointer underline ml-9">Tabela de medidas</span>
        </p>
        <div className="flex gap-2 flex-wrap">
          {tamanhos.map((size) => (
            <button
              key={size}
              onClick={() => setTamanhoSelecionado(size)}
              className={`botao-gradiente ${tamanhoSelecionado === size ? 'selecionado' : ''}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* FORMATO */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#103464] mb-2">FORMATO</p>
        <div className="flex gap-2">
          {formatos.map((format) => (
            <button
              key={format}
              onClick={() => setFormatoSelecionado(format)}
              className={`botao-gradiente ${formatoSelecionado === format ? 'selecionado' : ''}`}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {/* MASSA */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#103464] mb-1">MASSA</p>

        <div
          className="relative w-[191px] h-[39px] p-[1px] rounded-md"
          style={{
            background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)',
          }}
        >
          {/* Select com padding à direita pra não tampar a setinha */}
          <select
            className="w-full h-full pl-2 pr-8 rounded-md bg-white text-sm text-gray-700 appearance-none border-none outline-none"
          >
            <option>Selecione a massa</option>
          </select>

          {/* Setinha SVG custom */}
          <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-4 h-4 text-[#A47032]" // Mude a cor aqui
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* RECHEIO */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#103464] mb-1">RECHEIO</p>

        <div
          className="relative w-full p-[1px] rounded-md"
          style={{
            background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)',
          }}
        >
          <select
            className="w-full h-[39px] pl-2 pr-8 rounded-md bg-white text-sm text-gray-700 appearance-none border-none outline-none"
          >
            <option>Selecione o Recheio</option>
          </select>

          {/* Ícone da setinha */}
          <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-4 h-4 text-[#A47032]" // cor da setinha
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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