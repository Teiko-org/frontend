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
      navigate('/pedido-bolo');
    } else if (type === "Fornada" && available) {
      navigate('/pedido-fornada', { state: { produto } });
    } else if(type === "Fornada" && !available) {
      toast.error("Fornada esgotada");
    }
  };

  const getImageSrc = () => {
    console.log(`🖼️ [CARD DEBUG] Produto: ${getProductName()}`);
    console.log(`🖼️ [CARD DEBUG] Type: ${type}`);
    console.log(`🖼️ [CARD DEBUG] Props recebidas:`, { imagem, produto, boloData });
    
    // Prioridade 1: imagem passada como prop
    if (imagem) {
      console.log(`🖼️ [CARD DEBUG] Usando imagem da prop:`, imagem);
      return imagem;
    }
    
    // Prioridade 2: imagens do produto (tanto fornada quanto bolo)
    if (produto && produto.imagens && produto.imagens.length > 0) {
      const primeiraImagem = produto.imagens[0];
      // Se é um objeto com URL, extrai a URL. Senão, usa como string
      const imagemUrl = typeof primeiraImagem === 'object' && primeiraImagem.url 
        ? primeiraImagem.url 
        : primeiraImagem;
      console.log(`🖼️ [CARD DEBUG] Usando imagem do produto:`, imagemUrl);
      console.log(`🖼️ [CARD DEBUG] Estrutura produto.imagens:`, produto.imagens);
      return imagemUrl;
    }
    
    // Prioridade 3: imagens do boloData (para a Home)
    if (boloData && boloData.imagens && boloData.imagens.length > 0) {
      const primeiraImagem = boloData.imagens[0];
      // Se é um objeto com URL, extrai a URL. Senão, usa como string
      const imagemUrl = typeof primeiraImagem === 'object' && primeiraImagem.url 
        ? primeiraImagem.url 
        : primeiraImagem;
      console.log(`🖼️ [CARD DEBUG] Usando imagem do boloData:`, imagemUrl);
      return imagemUrl;
    }
    
    // Fallback: imagem padrão baseada no tipo
    const fallbackImage = type === "Bolo" ? "src/assets/image_card.png" : "src/assets/image_fornada.png";
    console.log(`🖼️ [CARD DEBUG] Usando imagem fallback:`, fallbackImage);
    console.log(`🖼️ [CARD DEBUG] Motivos do fallback - produto:`, produto);
    if (produto) {
      console.log(`🖼️ [CARD DEBUG] produto.imagens:`, produto.imagens);
      console.log(`🖼️ [CARD DEBUG] produto.imagens?.length:`, produto.imagens?.length);
    }
    
    return fallbackImage;
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
              // Se a imagem falhar ao carregar, usa uma imagem padrão
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