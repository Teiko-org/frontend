import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AvailableBox from "../AvailableBox";
// import SoldOutBox from "../SoldOutBox";
import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";
import defaultBoloImg from "../../assets/image_card.png";
import defaultFornadaImg from "../../assets/image_fornada.png";
import soldOutImg from "../../assets/card_esgotado.png"; // alterado para a nova imagem

function Card({ available, type, produto, nome, preco, imagem, boloData, onClick }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

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
    const normalizeImageUrl = (url) => {
      if (!url) return url;
      try {
        // Garante que URLs absolutas apontando para localhost:8080 ou 10.x.x.x:8080
        // sejam roteadas via proxy do frontend em /api
        const parsed = new URL(url, window.location.origin);
        const isLocalhost = parsed.hostname === 'localhost' && (parsed.port === '8080' || parsed.port === '');
        const isPrivate10 = /^10\.\d+\.\d+\.\d+$/.test(parsed.hostname) && (parsed.port === '8080' || parsed.port === '');
        if (isLocalhost || isPrivate10) {
          return `/api${parsed.pathname}${parsed.search}`;
        }
        // Se vier um caminho da API como /files/... também deve ir via /api
        if (parsed.origin === window.location.origin) {
          if (parsed.pathname.startsWith('/files')) {
            return `/api${parsed.pathname}${parsed.search}`;
          }
        }
        return url;
      } catch (_e) {
        // Caminhos relativos vindos do backend, ex.: /files/... ou files/...
        if (url.startsWith('/files')) return `/api${url}`;
        if (url.startsWith('files/')) return `/api/${url}`;
        return url; // deixa como está para outras urls relativas de assets
      }
    };

    if (imagem) {
      return normalizeImageUrl(imagem);
    }
    
    if (produto && produto.imagens && produto.imagens.length > 0) {
      const primeiraImagem = produto.imagens[0];
      const imagemUrl = typeof primeiraImagem === 'object' && primeiraImagem.url 
        ? primeiraImagem.url 
        : primeiraImagem;
      return normalizeImageUrl(imagemUrl);
    }
    
    if (boloData && boloData.imagens && boloData.imagens.length > 0) {
      const primeiraImagem = boloData.imagens[0];
      const imagemUrl = typeof primeiraImagem === 'object' && primeiraImagem.url 
        ? primeiraImagem.url 
        : primeiraImagem;
      return normalizeImageUrl(imagemUrl);
    }
    
    return type === "Bolo" ? defaultBoloImg : defaultFornadaImg;
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
    if (produto && produto.quantidade !== undefined) {
      return produto.quantidade;
    }
    return 0;
  };

  const getQuantitySold = () => {
    if (produto && produto.quantidadeVendida !== undefined) {
      return produto.quantidadeVendida;
    }
    return 0;
  };

  const getTotalQuantity = () => {
    if (produto && produto.quantidadeTotal !== undefined) {
      return produto.quantidadeTotal;
    }
    // Se não tem quantidade total, usa a quantidade atual como total
    return getQuantity() + getQuantitySold();
  };

  const getQuantityText = () => {
    const total = getTotalQuantity();
    const vendida = getQuantitySold();
    const disponivel = getQuantity();
    
    if (total > 0) {
      return `${disponivel} de ${total} disponíveis`;
    }
    return `${disponivel} disponíveis`;
  };

  return (
    <div
      className={`group relative w-[280px] h-[410px] ${type === "Fornada" && !available ? 'cursor-not-allowed' : 'cursor-pointer'} transition-transform duration-200 hover:scale-105`}
      onClick={handleClick}
    >
      <div className="absolute top-2 left-2 w-full h-full border-2 border-goldCard rounded-tr-2xl"></div>
      <div className={`relative bg-white shadow-lg border-2 border-gold rounded-tr-2xl w-full h-full`}>
        <div className="px-3 pt-3 pb-2 flex justify-center items-center relative">
          <img
            src={getImageSrc()}
            alt={getProductName()}
            className="w-[286px] h-[300px] object-cover rounded-tr-lg"
            onError={(e) => {
              e.target.src = type === "Bolo" ? defaultBoloImg : defaultFornadaImg;
            }}
          />
          {type === 'Fornada' && available && (
            <div className="absolute inset-0 rounded-tr-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="absolute inset-0 rounded-tr-lg bg-black/45"></div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[260px] bg-black/60 backdrop-blur-sm rounded-2xl px-3 py-3 flex flex-col items-center gap-2 pointer-events-auto z-10">
                <div className="flex items-center gap-2 text-sm">
                  <button
                    className="bg-white/90 text-blue border-2 border-gold px-3 py-1 rounded-full font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/pedido-fornada', { state: { produto } });
                    }}
                  >
                    Ver detalhes
                  </button>
                  <button
                    className="bg-gradient-to-l from-gold to-darkGold text-blue border-2 border-gold px-4 py-1 rounded-full font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!produto || produto.quantidade <= 0) {
                        toast.warn("Produto esgotado");
                        return;
                      }
                      addItem({
                        id: produto.id,
                        name: produto.produto,
                        price: produto.valor,
                        imagens: produto.imagens,
                        type: 'Fornada',
                        fornadaDaVezId: produto.fornadaDaVezId,
                        maxQuantity: produto.quantidade
                      }, qty);
                      toast.success("Adicionado ao carrinho");
                      setQty(1);
                    }}
                  >
                    Adicionar
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <button
                    className="px-3 py-0.5 border-2 border-gold rounded-full text-blue bg-white/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQty((v) => Math.max(1, v - 1));
                    }}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold text-white">{qty}</span>
                  <button
                    className="px-3 py-0.5 border-2 border-gold rounded-full text-blue bg-white/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      const max = produto?.quantidade ?? 9999;
                      setQty((v) => Math.min(max, v + 1));
                    }}
                    disabled={(produto?.quantidade ?? 1) <= qty}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
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
      {type === "Fornada" && (
        available
          ? <AvailableBox quantity={getQuantity()} quantityText={getQuantityText()} />
          : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <img
                src={soldOutImg}
                alt="Esgotado"
                className="w-full h-full object-cover rounded-tr-2xl"
                draggable={false}
              />
            </div>
          )
      )}
    </div>
  );
}

export default Card;