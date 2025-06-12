import React, { useContext } from 'react';
import { FormContext } from '../../contexts/FormContext';

const ValorEstimado = ({ className = "", withAnimation = false }) => {
  const { valorEstimado } = useContext(FormContext);

  return (
    <div className={`text-gradient font-bold text-lg ${withAnimation ? 'transition-all duration-300' : ''} ${className}`}>
      VALOR ESTIMADO: R$ {valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
  );
};

export default ValorEstimado; 