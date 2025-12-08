import React from 'react';
import { IoChevronDown } from "react-icons/io5";

const Select = React.forwardRef(({ label, options, placeholder, disabled, width, defaultValue, onChange, value, rounded }, ref) => {
  return (
    <div className="mb-1" style={{ width: width || '100%', minWidth: '250px' }}>
      {label && <label className="block text-blue font-semibold mb-1">{label}</label>}
      <div className="relative w-full">
        <select
          ref={ref}
          value={value !== undefined && value !== null ? value : ""}
          onChange={onChange}
          className={`block appearance-none w-full bg-white border-2 border-gold rounded-${rounded ? rounded : 'lg'} px-4 py-2 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          style={{ 
            paddingRight: '2.5rem',
            minWidth: '100%',
            width: '100%'
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