import React from 'react';
import { IoCalendarOutline } from "react-icons/io5";

const CustomDatePicker = ({ label, value, onChange, placeholder = "Selecione a data", min }) => {

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

  // Usar a prop min se fornecida, senão usar a data de hoje
  const minDate = min || getToday();

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
          className="w-full bg-white border-2 border-gold rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-blue transition-colors duration-200 cursor-pointer"
          value={value || ''}
          onChange={handleDateChange}
          min={minDate}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default CustomDatePicker; 