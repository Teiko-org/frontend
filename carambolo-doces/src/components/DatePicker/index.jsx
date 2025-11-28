import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import pt from 'date-fns/locale/pt-BR';
import MaskedInput from 'react-text-mask';
import { IoCalendarOutline } from "react-icons/io5";
import './DatePickerStyles.css';

registerLocale('pt-BR', pt);

const CustomDatePicker = React.forwardRef(({ label, placeholder, value, onChange }, ref) => {
  const [startDate, setStartDate] = useState(() => {
    if (!value) return null;
    // Se for string no formato YYYY/MM/DD, converter para Date
    if (typeof value === 'string' && value.includes('/')) {
      const parts = value.split('/');
      if (parts.length === 3 && parts[0].length === 4) {
        // Formato YYYY/MM/DD
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return !isNaN(date.getTime()) ? date : null;
      } else if (parts.length === 2 || (parts.length === 3 && parts[0].length === 2)) {
        // Formato DD/MM ou DD/MM/YYYY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear();
        const date = new Date(year, month, day);
        return !isNaN(date.getTime()) ? date : null;
      }
    }
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date : null;
  });

  useEffect(() => {
    if (!value) {
      setStartDate(null);
      return;
    }
    // Se for string no formato YYYY/MM/DD, converter para Date
    if (typeof value === 'string' && value.includes('/')) {
      const parts = value.split('/');
      if (parts.length === 3 && parts[0].length === 4) {
        // Formato YYYY/MM/DD
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (!isNaN(date.getTime())) {
          setStartDate(date);
        }
        return;
      } else if (parts.length === 2 || (parts.length === 3 && parts[0].length === 2)) {
        // Formato DD/MM ou DD/MM/YYYY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear();
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          setStartDate(date);
        }
        return;
      }
    }
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setStartDate(date);
    }
  }, [value]);

  const formatDateForBackend = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
  return '';
};

  const handleDateChange = (date) => {
    setStartDate(date);
    if (date instanceof Date && !isNaN(date.valueOf())) {
      const formattedDate = formatDateForBackend(date);
      onChange(formattedDate);
    } else if (date === null) {
      onChange('');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const [day, month] = value.split('/');
    if (day && month && day.length === 2 && month.length === 2) {
      const date = new Date(new Date().getFullYear(), month - 1, day);
      if (!isNaN(date.valueOf())) {
        setStartDate(date);
        const formattedDate = formatDateForBackend(date);
        onChange(formattedDate);
      }
    }
  };

  return (
    <div className="">
      {label && <label className="block text-blue font-semibold mb-1">{label}</label>}
      <div className="relative w-full">
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          dateFormat="dd/MM"
          minDate={new Date()}
          placeholderText={placeholder}
          locale="pt-BR"
          customInput={
            <MaskedInput
              mask={[/\d/, /\d/, '/', /\d/, /\d/]}
              value={
                startDate instanceof Date && !isNaN(startDate)
                  ? `${String(startDate.getDate()).padStart(2, '0')}/${String(
                      startDate.getMonth() + 1
                    ).padStart(2, '0')}`
                  : ''
              }
              ref={ref}
              onChange={handleInputChange}
              className="w-full bg-white border-2 border-gold rounded-lg px-4 py-2 pr-10 cursor-pointer"
            />
          }
          calendarClassName="border-gold"
          wrapperClassName="w-full"
        />
        <div 
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 pointer-events-none cursor-pointer"
        >
          <IoCalendarOutline />
        </div>
      </div>
    </div>
  );
});

export default CustomDatePicker;