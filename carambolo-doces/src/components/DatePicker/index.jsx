import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import pt from 'date-fns/locale/pt-BR';
import MaskedInput from 'react-text-mask';
import { IoCalendarOutline } from "react-icons/io5";
import './DatePickerStyles.css';

registerLocale('pt-BR', pt);

const CustomDatePicker = React.forwardRef(({ label, placeholder, value, onChange }, ref) => {
  const [startDate, setStartDate] = useState(() => {
    return value && !isNaN(new Date(value)) ? new Date(value) : null;
  });

  const formatDateForBackend = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
    return '';
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    if (date instanceof Date && !isNaN(date.valueOf())) {
      const formattedDate = formatDateForBackend(date);
      onChange(formattedDate);
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
    <div className="mb-4">
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