import React from 'react';

const InputOption = ({ type, label, checked, onChange }) => {
  return (
    <label className="flex items-center text-blue font-medium cursor-pointer">
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className="hidden peer"
      />
      <div
        className={`flex items-center justify-center mr-2 w-6 h-6 cursor-pointer ${
          type === 'radio' ? 'rounded-full border-2 border-gold' : 'rounded-md border border-gold'
        } ${
          checked
            ? type === 'radio' 
              ? 'bg-white' 
              : 'bg-gradient-to-t from-darkGold to-gold'
            : 'bg-white'
        } peer-focus:ring-2 ring-darkGoldButton`}
      >
        {checked && (
          type === 'radio' ? (
            <div className="w-2 h-2 bg-gradient-to-t from-darkGold to-gold rounded-full"></div>
          ) : (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )
        )}
      </div>
      {label}
    </label>
  );
};

export default InputOption;