import React, { useEffect, useState, useMemo } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import Button from "../../components/Button";
import BannerPrincipal from "../../components/BannerPrincipal";
import BannerFornada from "../../components/BannerFornada";
import { getFornadaAtiva, getProdutosFornadaComImagens } from "../../service/fornadaService";
import { findFeaturedDecoracoes } from "../../service/productService";
import Carousel from "../../components/Carousel";
import './cardsTransition.css';

function Home() {
  const [decoracoes, setDecoracoes] = useState([]);
  const [produtosFornada, setProdutosFornada] = useState([]);
  const [fornada, setFornada] = useState(null);

  useEffect(() => {
    const fetchDecoracoes = async () => {
      try {
        const data = await findFeaturedDecoracoes();
        setDecoracoes(data);
      } catch (error) {
        console.error("Erro ao carregar decorações:", error);
      }
    };
    
    const carregarDadosFornada = async () => {
      try {
        const fornadaAtual = await getFornadaAtiva();
        
        if (fornadaAtual) {
          setFornada(fornadaAtual);
          const produtos = await getProdutosFornadaComImagens(fornadaAtual.id);
          setProdutosFornada(produtos.slice(0, 4));
        }
      } catch (error) {
        console.error("Erro ao carregar dados da fornada:", error);
      }
    };

    fetchDecoracoes();
    carregarDadosFornada();
  }, []);

  const slides = useMemo(() => {
    if (!decoracoes || decoracoes.length === 0) {
      return [
        { image: "src/assets/image_card.png", title: "Carambolos Vintage" },
        { image: "src/assets/image_card.png", title: "Carambolos Birthday" },
        { image: "src/assets/image_card.png", title: "Carambolos Estampado" },
        { image: "src/assets/image_card.png", title: "Monte o seu Carambolo" },
      ];
    }
    return decoracoes.map((d) => ({ image: d.imagens?.[0] ?? "src/assets/image_card.png", title: d.categoria ?? d.nome }));
  }, [decoracoes]);

  return (
    <div className="bg-bgNativeHome">
      <Header />
      <BannerPrincipal />
      <div className="h-12"></div>
      <BannerFornada fornada={fornada} />
      <div className="h-12"></div>
      {/* Carambolos Pré-Decorados - com carrossel */}
      <section className="pt-8 pb-8 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          CARAMBOLOS PRÉ-DECORADOS
        </h2>
        <div className="px-6">
          <Carousel slides={slides} autoPlay interval={3500} />
        </div>
        <div className="h-10"></div>
        <div className="flex justify-center">
          <Button
            text="Ver mais temas"
            bgColor="bg-gradient-to-l from-gold to-darkGold"
            fontSize="text-lg"
            textColor="text-blue"
            borderColor="border-gold"
          />
        </div>
      </section>
      <div className="h-24"></div>
      {/* Fornada da Semana */}
      <section className="pt-8 pb-16 bg-bgHome border-t border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          FORNADA DA SEMANA
        </h2>
        <div className="flex justify-between items-center px-4">
          <ArrowButton direction="left" />
          <div className="flex space-x-14">
            {produtosFornada.length > 0 ? (
              produtosFornada.map((produto) => (
                <Card
                  key={produto.fornadaDaVezId}
                  type="Fornada"
                  available={produto.quantidade > 0 && produto.isAtivo}
                  produto={produto}
                />
              ))
            ) : (
              <>
                <Card type="Fornada" available={true} />
                <Card type="Fornada" available={false} />
                <Card type="Fornada" available={true} />
                <Card type="Fornada" available={true} />
              </>
            )}
          </div>
          <ArrowButton direction="right" />
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;