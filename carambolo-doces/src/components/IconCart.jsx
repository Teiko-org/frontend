import React from "react";

function IconCart({ className = "w-6 h-6", color = "#A47032" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      className={className}
      fill="none"
    >
      <path
        d="M8 8h10l10 28h42l12-16c2.7-3.6 0-8-4.4-8H14"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="84" r="6" stroke={color} strokeWidth="6" />
      <circle cx="74" cy="84" r="6" stroke={color} strokeWidth="6" />
    </svg>
  );
}

export default IconCart;


