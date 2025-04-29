import React from 'react';
import { IoChevronDown } from "react-icons/io5";

const Select = ({ label, options, placeholder, disabled, width, defaultValue }) => {
  return (
    <div className="mb-4" style={{ width: width || '100%' }}>
      {label && <label className="block text-blue font-semibold mb-1">{label}</label>}
      <div className="relative">
        <select
          value={defaultValue}
          className={`block appearance-none w-full bg-white border-2 border-gold rounded-lg px-4 py-2 pr-8 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          disabled={disabled}
        >
          <option>{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gold">
          <IoChevronDown />
        </div>
      </div>
    </div>
  );
};

export default Select;