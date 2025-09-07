import React, { useState, forwardRef, useEffect, useRef } from 'react';
import './PhoneInputCustom.css';

const countries = [
  { code: 'BR', flag: '🇧🇷', dialCode: '+55', name: 'Brasil', format: '(XX) XXXXX-XXXX' },
  { code: 'US', flag: '🇺🇸', dialCode: '+1', name: 'Estados Unidos', format: '(XXX) XXX-XXXX' },
  { code: 'AR', flag: '🇦🇷', dialCode: '+54', name: 'Argentina', format: '(XX) XXXX-XXXX' },
  { code: 'CL', flag: '🇨🇱', dialCode: '+56', name: 'Chile', format: '(X) XXXX-XXXX' },
  { code: 'CO', flag: '🇨🇴', dialCode: '+57', name: 'Colômbia', format: '(XXX) XXX-XXXX' },
  { code: 'MX', flag: '🇲🇽', dialCode: '+52', name: 'México', format: '(XX) XXXX-XXXX' },
  { code: 'PE', flag: '🇵🇪', dialCode: '+51', name: 'Peru', format: '(XXX) XXX-XXX' },
  { code: 'UY', flag: '🇺🇾', dialCode: '+598', name: 'Uruguai', format: 'XXXX-XXXX' },
  { code: 'PY', flag: '🇵🇾', dialCode: '+595', name: 'Paraguai', format: '(XXX) XXX-XXX' },
  { code: 'BO', flag: '🇧🇴', dialCode: '+591', name: 'Bolívia', format: '(X) XXX-XXXX' },
  { code: 'EC', flag: '🇪🇨', dialCode: '+593', name: 'Equador', format: '(XX) XXX-XXXX' },
  { code: 'VE', flag: '🇻🇪', dialCode: '+58', name: 'Venezuela', format: '(XXX) XXX-XXXX' },
  { code: 'PT', flag: '🇵🇹', dialCode: '+351', name: 'Portugal', format: 'XXX XXX XXX' },
  { code: 'ES', flag: '🇪🇸', dialCode: '+34', name: 'Espanha', format: 'XXX XXX XXX' },
  { code: 'FR', flag: '🇫🇷', dialCode: '+33', name: 'França', format: 'XX XX XX XX XX' },
  { code: 'DE', flag: '🇩🇪', dialCode: '+49', name: 'Alemanha', format: 'XXX XXXXXXX' },
  { code: 'IT', flag: '🇮🇹', dialCode: '+39', name: 'Itália', format: 'XXX XXX XXXX' },
  { code: 'GB', flag: '🇬🇧', dialCode: '+44', name: 'Reino Unido', format: 'XXXX XXX XXX' },
  { code: 'CA', flag: '🇨🇦', dialCode: '+1', name: 'Canadá', format: '(XXX) XXX-XXXX' },
  { code: 'AU', flag: '🇦🇺', dialCode: '+61', name: 'Austrália', format: 'XXXX XXX XXX' }
];

const PhoneInputCustom = forwardRef(({ value, onChange, placeholder, includeCountryCode = true, ...props }, ref) => {
  const [phoneValue, setPhoneValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Brasil por padrão
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);

  const formatPhone = (input, country) => {
    const numbers = input.replace(/\D/g, '');
    
    // Remove o código do país se estiver presente
    let cleanNumbers = numbers;
    const countryCode = country.dialCode.replace('+', '');
    if (numbers.startsWith(countryCode) && numbers.length > countryCode.length) {
      cleanNumbers = numbers.substring(countryCode.length);
    }
    
    // Formatação específica por país
    switch (country.code) {
      case 'BR':
        if (cleanNumbers.length === 0) return '';
        if (cleanNumbers.length <= 2) return `(${cleanNumbers}`;
        if (cleanNumbers.length <= 7) return `(${cleanNumbers.slice(0, 2)}) ${cleanNumbers.slice(2)}`;
        if (cleanNumbers.length <= 11) return `(${cleanNumbers.slice(0, 2)}) ${cleanNumbers.slice(2, 7)}-${cleanNumbers.slice(7)}`;
        const truncated = cleanNumbers.slice(0, 11);
        return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
      
      case 'US':
      case 'CA':
        if (cleanNumbers.length === 0) return '';
        if (cleanNumbers.length <= 3) return `(${cleanNumbers}`;
        if (cleanNumbers.length <= 6) return `(${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3)}`;
        if (cleanNumbers.length <= 10) return `(${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6)}`;
        const usTruncated = cleanNumbers.slice(0, 10);
        return `(${usTruncated.slice(0, 3)}) ${usTruncated.slice(3, 6)}-${usTruncated.slice(6)}`;
      
      default:
        // Formatação genérica para outros países
        if (cleanNumbers.length === 0) return '';
        if (cleanNumbers.length <= 3) return cleanNumbers;
        if (cleanNumbers.length <= 6) return `${cleanNumbers.slice(0, 3)} ${cleanNumbers.slice(3)}`;
        if (cleanNumbers.length <= 9) return `${cleanNumbers.slice(0, 3)} ${cleanNumbers.slice(3, 6)} ${cleanNumbers.slice(6)}`;
        const defaultTruncated = cleanNumbers.slice(0, 9);
        return `${defaultTruncated.slice(0, 3)} ${defaultTruncated.slice(3, 6)} ${defaultTruncated.slice(6)}`;
    }
  };

  const extractNumbers = (formatted, country) => {
    // Remove todos os caracteres não numéricos
    const numbers = formatted.replace(/\D/g, '');
    const countryCode = country.dialCode.replace('+', '');
    
    console.log('extractNumbers Debug:', {
      formatted,
      numbers,
      countryCode,
      includeCountryCode
    });
    
    // Remove o código do país se estiver presente
    let cleanNumbers = numbers;
    if (numbers.startsWith(countryCode) && numbers.length > countryCode.length) {
      cleanNumbers = numbers.substring(countryCode.length);
    }
    
    // Se includeCountryCode for true, adiciona o código do país
    if (includeCountryCode) {
      const result = `${countryCode}${cleanNumbers}`;
      console.log('extractNumbers Result (with country code):', result);
      return result;
    }
    
    // Retorna apenas os números limpos (sem formatação e sem código do país)
    console.log('extractNumbers Result (without country code):', cleanNumbers);
    return cleanNumbers;
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhone(input, selectedCountry);
    const numbersOnly = extractNumbers(formatted, selectedCountry);
    
    setPhoneValue(formatted);
    
    if (onChange) {
      onChange(numbersOnly);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    // Reformatar o número com o novo país
    const numbersOnly = extractNumbers(phoneValue, country);
    const formatted = formatPhone(numbersOnly.replace(country.dialCode.replace('+', ''), ''), country);
    setPhoneValue(formatted);
  };

  useEffect(() => {
    if (value) {
      const formatted = formatPhone(value, selectedCountry);
      setPhoneValue(formatted);
    }
  }, [value, selectedCountry]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="phone-input-custom-container" ref={containerRef}>
      <div className="phone-input-custom-flag-section" onClick={() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
          });
        }
        setIsDropdownOpen(!isDropdownOpen);
      }}>
        <span className="phone-input-custom-flag">{selectedCountry.flag}</span>
        <span className="phone-input-custom-country-code">{selectedCountry.dialCode}</span>
        <span className="phone-input-custom-arrow">▼</span>
      </div>
      
      {isDropdownOpen && (
        <div 
          className="phone-input-custom-dropdown"
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 99999
          }}
        >
          {countries.map((country) => (
            <div
              key={country.code}
              className="phone-input-custom-dropdown-item"
              onClick={() => handleCountrySelect(country)}
            >
              <span className="phone-input-custom-dropdown-flag">{country.flag}</span>
              <span className="phone-input-custom-dropdown-name">{country.name}</span>
              <span className="phone-input-custom-dropdown-code">{country.dialCode}</span>
            </div>
          ))}
        </div>
      )}
      
      <input
        {...props}
        ref={ref}
        type="tel"
        value={phoneValue}
        onChange={handleInputChange}
        placeholder={placeholder || selectedCountry.format}
        className="phone-input-custom-input"
        maxLength={20}
      />
    </div>
  );
});

PhoneInputCustom.displayName = 'PhoneInputCustom';

export default PhoneInputCustom;
