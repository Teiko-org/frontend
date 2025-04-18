import React from "react";

function AvailableBox({ quantity }) {
  return (
    <div className="absolute right-0 top-full transform translate-x-1/4 translate-y-[-50%] mt-2 bg-blue text-white text-sm font-medium rounded-md border border-gold px-4 py-2 shadow-md whitespace-nowrap">
      {quantity} Disponíveis
    </div>
  );
}

export default AvailableBox;