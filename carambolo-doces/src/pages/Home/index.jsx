import React, { useEffect, useState } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import Button from "../../components/Button";
import BannerPrincipal from "../../components/BannerPrincipal";
import BannerFornada from "../../components/BannerFornada";
import { getFornadaAtiva, getProdutosFornadaComImagens } from "../../service/fornadaService";
import { getBolosComImagens } from "../../service/boloService";
import './cardsTransition.css';

function Home() {
  const [bolos, setBolos] = useState([]);
  const [produtosFornada, setProdutosFornada] = useState([]);
  const [fornada, setFornada] = useState(null);
  
  const [boloPage, setBoloPage] = useState(0);
  const bolosPerPage = 3;
  const totalBoloPages = Math.ceil(bolos.length / bolosPerPage);
  const paginatedBolos = bolos.slice(
    boloPage * bolosPerPage,
    boloPage * bolosPerPage + bolosPerPage
  );

  const handleBoloPrev = () => {
    setBoloPage((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  const handleBoloNext = () => {
    setBoloPage((prev) => (prev < totalBoloPages - 1 ? prev + 1 : prev));
  };

  useEffect(() => {
    const fetchBolos = async () => {
      try {
        const data = await getBolosComImagens();
        setBolos(data);
      } catch (error) {
        console.error("Erro ao carregar bolos:", error);
      }
    };
    
    const carregarDadosFornada = async () => {
      try {
        const fornadaAtual = await getFornadaAtiva();
        
        if (fornadaAtual) {
          setFornada(fornadaAtual);
          const produtos = await getProdutosFornadaComImagens(fornadaAtual.id);
          setProdutosFornada(produtos.slice(0, 4)); // Limita a 4 produtos na home
        }
      } catch (error) {
        console.error("Erro ao carregar dados da fornada:", error);
      }
    };

    fetchBolos();
    carregarDadosFornada();
  }, []);

  return (
    <div className="bg-bgNativeHome">
      <Header />
      <BannerPrincipal />
      <div className="h-12"></div>
      <BannerFornada fornada={fornada} />
      <div className="h-12"></div>
      {/* Carambolos Pré-Decorados */}
      <section className="pt-8 pb-8 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          CARAMBOLOS PRÉ-DECORADOS
        </h2>
        <div className="flex justify-between items-center px-4">
          <ArrowButton direction="left" onClick={handleBoloPrev} />
          <div className="flex space-x-4">
            {paginatedBolos.length > 0 ? (
              paginatedBolos.map((bolo) => (
                <Card
                  key={bolo.boloId}
                  type="Bolo"
                  nome={bolo.produto}
                  preco={bolo.precoTotal}
                  boloData={bolo}
                />
              ))
            ) : (
              <>
            <Card type="Bolo" />
            <Card type="Bolo" />
            <Card type="Bolo" />
              </>
            )}
          </div>
          <ArrowButton direction="right" onClick={handleBoloNext} />
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
      {/* Carambolos Mais Pedidos */}
      {/* <section className="pt-8 pb-16 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          CARAMBOLOS MAIS PEDIDOS
        </h2>
        <div className="flex justify-between items-center px-4">
          <ArrowButton direction="left" />
          <div className="flex space-x-24">
            <Card type="Bolo" />
            <Card type="Bolo" />
            <Card type="Bolo" />
          </div>
          <ArrowButton direction="right" />
        </div>
      </section> */}
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