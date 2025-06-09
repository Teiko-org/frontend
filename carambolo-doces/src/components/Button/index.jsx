import React from "react";

function Button({ 
  text, 
  onClick,
  bgColor = "bg-gradient-to-l from-gold to-darkGold", 
  fontSize = "text-lg", 
  textColor = "text-blue", 
  borderColor = "border-gold",
  className = "",
  disabled = false
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${disabled ? 'bg-gray-400 cursor-not-allowed' : bgColor} ${fontSize} ${textColor} ${borderColor} font-bold py-1 px-4 rounded-full shadow-md border-2 focus:outline-none ${disabled ? '' : 'transform hover:scale-105 transition-transform'} ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;