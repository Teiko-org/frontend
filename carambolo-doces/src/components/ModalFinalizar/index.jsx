import React from 'react';
import ModalBase from '../ModalBase';
import Button from '../Button';
import TextGradiante from '../textGradiente';
import { useNavigate } from 'react-router-dom';

export default function ModalFinalizar({
  isOpen,
  onClose,
  onFinalize,
  valorEstimado = 0,
  horariosEntrega = [
    'SEG - 14:00 as 19:00',
    'TER - 14:00 as 19:00',
    'QUA - 14:00 as 19:00',
    'QUI - 14:00 as 19:00',
    'SEX - 14:00 as 19:00',
    'SÁB - 14:00 as 19:00',
  ],
  horariosRetirada = [
    'SEG - 14:00 as 17:00',
    'TER - 14:00 as 17:00',
    'QUA - 14:00 as 17:00',
    'QUI - 14:00 as 17:00',
    'SEX - 14:00 as 17:00',
    'SÁB - 14:00 as 17:00',
  ],
  cuidados = [
    'Ao recebê-lo deixe pelo menos 10 minutinhos na geladeira para que endureça.',
    'Prazo de Validade de até 5 dias.',
  ]
}) {
  const navigate = useNavigate();

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} width="800px" height="auto">
      <div className="flex flex-col h-full justify-between space-y-8 px-4 py-2">
        <div className="flex justify-between gap-12 font-montserrat text-sm leading-relaxed">
          <div className="space-y-6">
            <div>
              <TextGradiante>
                <p className="text-sm font-semibold font-montserrat mb-1">
                  Horários Entrega:
                </p>
              </TextGradiante>

              <ul className="space-y-1">
                {horariosEntrega.map((horario, idx) => (
                  <li key={idx}>{horario}</li>
                ))}
              </ul>
            </div>

            <div className="mt-2">
              <TextGradiante>
                <p className="text-sm font-semibold mb-1">Horários Retirada:</p>
              </TextGradiante>
              <ul className="space-y-1">
                {horariosRetirada.map((horario, idx) => (
                  <li key={idx}>{horario}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 max-w-[280px]">
            <div>
              <TextGradiante>
                <p className="font-semibold mb-1">Cuidados com o seu Carambolo</p>
              </TextGradiante>
              <ul className="list-disc list-inside space-y-1 text-white">
                {cuidados.map((texto, idx) => (
                  <li key={idx}>{texto}</li>
                ))}
              </ul>
            </div>

            <div className="pt-10 text-white font-bold text-center">
              <TextGradiante>
                <span className="">VALOR ESTIMADO:</span>{" "}
                R$ {Number(valorEstimado || 0).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TextGradiante>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            text="Finalizar"
            onClick={async () => {
              try {
                await onFinalize();
              } finally {
                navigate("/");
              }
            }}
            bgColor="bg-gradient-to-l from-gold to-darkGold"
            fontSize="text-base"
            textColor="text-blue"
            borderColor="border-gold"
          />
        </div>
      </div>
    </ModalBase>
  );
}