import React from "react";
import { useNavigate } from "react-router-dom";
import AvailableBox from "../AvailableBox";
import SoldOutBox from "../SoldOutBox";

function Card({ available, type }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "Bolo" || (type === "Fornada" && available)) {
      navigate('/pedido-bolo');
    }
  };

  const imageSrc = type === "Bolo"
    ? "src/assets/image_card.png"
    : "src/assets/image_fornada.png";

  return (
    <div
      className={`relative w-[280px] h-[410px] ${type === "Fornada" && !available ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleClick}
    >
      <div className="absolute top-2 left-2 w-full h-full border-2 border-goldCard rounded-tr-2xl"></div>
      <div className={`relative ${type === "Fornada" && !available ? 'opacity-75' : ''} bg-white shadow-lg border-2 border-gold rounded-tr-2xl w-full h-full`}>
        <div className="px-3 pt-3 pb-2 flex justify-center items-center">
          <img
            src={imageSrc}
            alt={type === "Bolo" ? "Bolo Vintage" : "Brownie Fornada"}
            className="w-[286px] h-[300px] object-cover rounded-tr-lg"
          />
        </div>
        <div className="px-4 h-[76px] flex flex-col justify-between">
          <div className="font-medium text-blue text-lg">
            {type === "Bolo"
              ? "Carambolo Vintage Aniversário"
              : "Brownie de Chocolate com Caramelo"}
          </div>
          <div className="font-semibold text-blue text-xl">
            A partir de R$ XXX,XX
          </div>
        </div>
      </div>
      {type === "Fornada" && (available ? <AvailableBox quantity={50} /> : <SoldOutBox />)}
    </div>
  );
}

export default Card;