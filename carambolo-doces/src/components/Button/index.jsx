import React from "react";

function Button({ 
  text, 
  onClick,
  bgColor = "bg-gradient-to-l from-gold to-darkGold", 
  fontSize = "text-lg", 
  textColor = "text-blue", 
  borderColor = "border-gold",
  className = ""
}) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${fontSize} ${textColor} ${borderColor} font-bold py-1 px-4 rounded-full shadow-md border-2 focus:outline-none transform hover:scale-105 transition-transform ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;