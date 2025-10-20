import React, { useState, forwardRef } from 'react';

const PhoneInputLogin = forwardRef(({ value, onChange, placeholder, ...props }, ref) => {
  const [formattedValue, setFormattedValue] = useState('');

  // Função para formatar o telefone brasileiro
  const formatPhone = (input) => {
    // Remove tudo que não é número
    const numbers = input.replace(/\D/g, '');
    
    let cleanNumbers = numbers;
    if (numbers.startsWith('55') && numbers.length > 11) {
      cleanNumbers = numbers.substring(2);
    }
    
    // Aplica a formatação baseada no tamanho
    if (cleanNumbers.length === 0) {
      return '';
    } else if (cleanNumbers.length <= 2) {
      return `(${cleanNumbers}`;
    } else if (cleanNumbers.length <= 7) {
      return `(${cleanNumbers.slice(0, 2)}) ${cleanNumbers.slice(2)}`;
    } else if (cleanNumbers.length <= 11) {
      return `(${cleanNumbers.slice(0, 2)}) ${cleanNumbers.slice(2, 7)}-${cleanNumbers.slice(7)}`;
    } else {
      // Se for muito longo, trunca para 11 dígitos
      const truncated = cleanNumbers.slice(0, 11);
      return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
    }
  };

  // Função para extrair apenas números do telefone formatado
  const extractNumbers = (formatted) => {
    const numbers = formatted.replace(/\D/g, '');
    // Se não começar com 55, adiciona
    if (numbers.length === 11 && !numbers.startsWith('55')) {
      return `55${numbers}`;
    }
    return numbers;
  };

  // Inicializa o valor formatado
  React.useEffect(() => {
    if (value) {
      setFormattedValue(formatPhone(value));
    }
  }, [value]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhone(input);
    const numbersOnly = extractNumbers(formatted);
    
    setFormattedValue(formatted);
    
    // Chama onChange com apenas os números (formato para o backend)
    if (onChange) {
      onChange(numbersOnly);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const formatted = formatPhone(pastedData);
    const numbersOnly = extractNumbers(formatted);
    
    setFormattedValue(formatted);
    
    if (onChange) {
      onChange(numbersOnly);
    }
  };

  return (
    <input
      {...props}
      ref={ref}
      type="tel"
      value={formattedValue}
      onChange={handleInputChange}
      onPaste={handlePaste}
      placeholder={placeholder}
      className="w-full py-2 px-4 rounded-lg"
      maxLength={20}
    />
  );
});

PhoneInputLogin.displayName = 'PhoneInputLogin';

export default PhoneInputLogin;
