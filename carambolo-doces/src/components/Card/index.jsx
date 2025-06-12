import React from "react";
import { useNavigate } from "react-router-dom";
import AvailableBox from "../AvailableBox";
import SoldOutBox from "../SoldOutBox";
import { toast } from "react-toastify";

function Card({ available, type, produto, nome, preco, imagem, boloData, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(boloData);
    } else if (type === "Bolo") {
      if (boloData) {
        localStorage.setItem('selectedBolo', JSON.stringify(boloData));
      }
      navigate('/pedido-bolo');
    } else if (type === "Fornada" && available) {
      navigate('/pedido-fornada', { state: { produto } });
    } else if(type === "Fornada" && !available) {
      toast.error("Fornada esgotada");
    }
  };

  const getImageSrc = () => {
    if (imagem) {
      return imagem;
    }
    
    if (produto && produto.imagens && produto.imagens.length > 0) {
      const primeiraImagem = produto.imagens[0];
      const imagemUrl = typeof primeiraImagem === 'object' && primeiraImagem.url 
        ? primeiraImagem.url 
        : primeiraImagem;
      return imagemUrl;
    }
    
    if (boloData && boloData.imagens && boloData.imagens.length > 0) {
      const primeiraImagem = boloData.imagens[0];
      const imagemUrl = typeof primeiraImagem === 'object' && primeiraImagem.url 
        ? primeiraImagem.url 
        : primeiraImagem;
      return imagemUrl;
    }
    
    return type === "Bolo" ? "src/assets/image_card.png" : "src/assets/image_fornada.png";
  };

  const getProductName = () => {
    if (nome) {
      return nome;
    }
    
    if (type === "Bolo") {
      return "Carambolo Vintage Aniversário";
    }
    
    return produto ? produto.produto : "Brownie de Chocolate com Caramelo";
  };

  const getProductPrice = () => {
    if (preco) {
      return `R$ ${preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    
    if (produto && produto.valor) {
      return `R$ ${produto.valor.toFixed(2).replace('.', ',')}`;
    }
    
    return "R$ XXX,XX";
  };

  const getQuantity = () => {
    return produto ? produto.quantidade : 50;
  };

  return (
    <div
      className={`relative w-[280px] h-[410px] ${type === "Fornada" && !available ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'} transition-transform duration-200 hover:scale-105`}
      onClick={handleClick}
    >
      <div className="absolute top-2 left-2 w-full h-full border-2 border-goldCard rounded-tr-2xl"></div>
      <div className={`relative ${type === "Fornada" && !available ? 'opacity-75' : ''} bg-white shadow-lg border-2 border-gold rounded-tr-2xl w-full h-full`}>
        <div className="px-3 pt-3 pb-2 flex justify-center items-center">
          <img
            src={getImageSrc()}
            alt={getProductName()}
            className="w-[286px] h-[300px] object-cover rounded-tr-lg"
            onError={(e) => {
              e.target.src = type === "Bolo" ? "src/assets/image_card.png" : "src/assets/image_fornada.png";
            }}
          />
        </div>
        <div className="px-4 h-[76px] flex flex-col justify-between">
          <div className="font-medium text-blue text-lg">
            {getProductName()}
          </div>
          <div className="font-semibold text-blue text-xl">
            A partir de {getProductPrice()}
          </div>
        </div>
      </div>
      {type === "Fornada" && (available ? <AvailableBox quantity={getQuantity()} /> : <SoldOutBox />)}
    </div>
  );
}

export default Card;