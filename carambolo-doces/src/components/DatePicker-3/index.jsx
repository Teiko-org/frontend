import React from 'react';
import { IoCalendarOutline } from "react-icons/io5";

const CustomDatePicker = ({ label, value, onChange, placeholder = "Selecione a data" }) => {
  
  // Função para obter a data de hoje no formato YYYY-MM-DD
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="block text-blue font-semibold mb-2 text-sm">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="date"
          className="w-full bg-white border-2 border-gold rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:border-blue transition-colors duration-200 cursor-pointer"
          value={value || ''}
          onChange={handleDateChange}
          min={getToday()}
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gold pointer-events-none">
          <IoCalendarOutline size={20} />
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker; 