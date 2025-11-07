import React from "react";
import { IoIosLock } from "react-icons/io";

function UnavailableOverlay({ motivo = "INDISPONÍVEL" }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-graySoldOut bg-opacity-50 rounded-2xl z-10 pointer-events-none">
      <div className="relative px-16 md:px-20 py-5 md:py-6 bg-gradient-to-t from-darkBlue to-blue text-white text-lg font-semibold rounded-xl border-2 border-gold flex flex-col items-center shadow-lg">
        <span className="text-2xl md:text-3xl uppercase">{motivo}</span>
        <div className="absolute w-full h-px bg-gold bottom-5 left-0"></div>
        <IoIosLock className="text-gold text-3xl md:text-4xl mt-2" />
      </div>
    </div>
  );
}

export default UnavailableOverlay;