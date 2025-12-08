import React from 'react';
import { IoChevronDown } from "react-icons/io5";

const Select = React.forwardRef(({ label, options, placeholder, disabled, width, defaultValue, onChange, value, rounded }, ref) => {
  const selectValue = value !== undefined && value !== null ? value : (defaultValue !== undefined && defaultValue !== null ? defaultValue : "");
  
  return (
    <div className="w-full">
      {label && <label className="block text-blue font-semibold mb-1">{label}</label>}
      <div className="relative w-full">
        <select
          ref={ref}
          value={selectValue}
          onChange={onChange}
          className={`w-full bg-white border-2 border-gold rounded-${rounded ? rounded : 'lg'} px-4 py-2 appearance-none ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          style={{ 
            paddingRight: '2.5rem',
            width: '100%',
            boxSizing: 'border-box'
          }}
          disabled={disabled}
        >
          {placeholder && !options?.some(opt => opt.value === "") && <option value="">{placeholder}</option>}
          {options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gold">
          <IoChevronDown />
        </div>
      </div>
    </div>
  );
});

export default Select;