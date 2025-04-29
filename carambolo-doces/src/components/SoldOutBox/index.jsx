import React from "react";
import { IoIosLock } from "react-icons/io";

function SoldOutBox() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-graySoldOut bg-opacity-50 rounded-tr-2xl">
      <div className="relative px-16 pt-4 bg-gradient-to-t from-darkBlue to-blue text-white text-lg font-semibold rounded-xl border-2 border-gold flex flex-col items-center">
        <span className="text-2xl">ESGOTADO</span>
        <div className="absolute w-full h-px bg-gold bottom-4 left-0"></div>
        <IoIosLock className="text-gold text-3xl mt-2" />
      </div>
    </div>
  );
}

export default SoldOutBox;