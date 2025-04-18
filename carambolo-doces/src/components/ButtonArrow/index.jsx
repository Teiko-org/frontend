import React from "react";
import { FaArrowRight, FaArrowLeft  } from "react-icons/fa";

function ArrowButton({ direction = "left", onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex justify-center items-center bg-transparent text-gold border-2 border-gold rounded-full h-16 w-16 focus:outline-none transform hover:scale-105 transition-transform"
    >
      {direction === "left" ? <FaArrowLeft /> : <FaArrowRight />}
    </button>
  );
}

export default ArrowButton;