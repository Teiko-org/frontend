import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import Button from "../../components/Button";
import BannerPrincipal from "../../components/BannerPrincipal";
import BannerFornada from "../../components/BannerFornada";
import { getFornada, getProdutosPorFornadaId } from "../../service/fornadaService";

function Home() {
  const [produtosFornada, setProdutosFornada] = useState([]);
  const [fornada, setFornada] = useState(null);
  
  // ID da fornada padrão (futuramente será dinâmico)
  // Para tornar dinâmico: pode vir de contexto global, localStorage, etc.
  const FORNADA_ID_PADRAO = 1;

  useEffect(() => {
    const carregarDadosFornada = async () => {
      try {
        const fornadaAtual = await getFornada(FORNADA_ID_PADRAO);
        if (fornadaAtual) {
          setFornada(fornadaAtual);
          const produtos = await getProdutosPorFornadaId(FORNADA_ID_PADRAO);
          setProdutosFornada(produtos.slice(0, 4)); // Limita a 4 produtos na home
        }
      } catch (error) {
        console.error("Erro ao carregar dados da fornada:", error);
      }
    };

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
          <ArrowButton direction="left" />
          <div className="flex space-x-4">
            <Card type="Bolo" />
            <Card type="Bolo" />
            <Card type="Bolo" />
          </div>
          <ArrowButton direction="right" />
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
      <section className="pt-8 pb-16 bg-bgHome border-t border-b border-gold">
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
              // Cards padrão se não houver dados
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