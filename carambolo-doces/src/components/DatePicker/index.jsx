import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoCalendarOutline } from "react-icons/io5";
import './DatePickerStyles.css';

const CustomDatePicker = ({ label, placeholder }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="mb-4">
      {label && <label className="block text-blue font-semibold mb-1">{label}</label>}
      <div className="relative w-full">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM"
          placeholderText={placeholder}
          className="w-full bg-white border-2 border-gold rounded-lg px-4 py-2 pr-10 cursor-text"
          calendarClassName="border-gold"
          wrapperClassName="w-full"
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 pointer-events-none">
          <IoCalendarOutline />
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker;