import React, { useState, useEffect } from 'react';
import ModalBaseForm from '../ModalBaseForm';
import Button from '../Button';
import './modalMontagem.css';

export default function ModalMontagem({ 
  isOpen, 
  onClose, 
  selectedSize = '13cm', 
  selectedShape = 'Redondo', 
  selectedMass = '', 
  selectedFilling = '', 
  onSave
}) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(selectedSize);
  const [formatoSelecionado, setFormatoSelecionado] = useState(selectedShape);
  const [massaSelecionada, setMassaSelecionada] = useState(selectedMass);
  const [recheioSelecionado, setRecheioSelecionado] = useState(selectedFilling);

  const tamanhos = ['11cm', '13cm', '15cm', '17cm'];
  const formatos = ['Redondo', 'Coração'];

  const handleSave = () => {
    onSave({
      size: tamanhoSelecionado,
      shape: formatoSelecionado,
      mass: massaSelecionada,
      filling: recheioSelecionado
    });
    onClose();
  };

  useEffect(() => {
    setTamanhoSelecionado(selectedSize);
    setFormatoSelecionado(selectedShape);
    setMassaSelecionada(selectedMass);
    setRecheioSelecionado(selectedFilling);
  }, [selectedSize, selectedShape, selectedMass, selectedFilling]);

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose} title="MONTAGEM">
      {/* TAMANHO */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#103464] mb-2">
          TAMANHO{' '}
          <span className="text-blue-700 text-xs cursor-pointer underline ml-9">
            Tabela de medidas
          </span>
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
          style={{ background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)' }}
        >
          <select
            className="w-full h-full pl-2 pr-8 rounded-md bg-white text-sm text-gray-700 appearance-none border-none outline-none"
            value={massaSelecionada}
            onChange={(e) => setMassaSelecionada(e.target.value)}
          >
            <option>Selecione a massa</option>
            <option value="Chocolate">Chocolate</option>
            <option value="Baunilha">Baunilha</option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-4 h-4 text-[#A47032]"
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
          style={{ background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)' }}
        >
          <select
            className="w-full h-[39px] pl-2 pr-8 rounded-md bg-white text-sm text-gray-700 appearance-none border-none outline-none"
            value={recheioSelecionado}
            onChange={(e) => setRecheioSelecionado(e.target.value)}
          >
            <option>Selecione o Recheio</option>
            <option value="Morango">Morango</option>
            <option value="Doce de Leite">Doce de Leite</option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-4 h-4 text-[#A47032]"
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
      <div className="flex justify-end mt-6">
        <Button
          text="Salvar"
          onClick={handleSave}
          bgColor="bg-gradient-to-l from-gold to-darkGold"
          fontSize="text-sm"
          textColor="text-blue"
          borderColor="border-gold"
        />
      </div>
    </ModalBaseForm>
  );
}
