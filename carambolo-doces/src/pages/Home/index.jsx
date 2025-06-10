import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import Button from "../../components/Button";
import BannerPrincipal from "../../components/BannerPrincipal";
import BannerFornada from "../../components/BannerFornada";
import { getBolosPorCategoria } from "../../service/boloService";
import './cardsTransition.css';

function Home() {
  const [bolos, setBolos] = useState([]);

  useEffect(() => {
    const fetchBolos = async () => {
      const data = await getBolosPorCategoria();
      setBolos(data);
    };
    fetchBolos();
  }, []);

  // Paginação para todos os bolos (independente da categoria)
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

  return (
    <div className="bg-bgNativeHome">
      <Header />
      <BannerPrincipal />
      <div className="h-12"></div>
      <BannerFornada />
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
                  // imagem={...} // Se houver campo de imagem futuramente
                />
              ))
            ) : (
              <span className="text-blue">Nenhum carambolo encontrado.</span>
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
            <Card type="Fornada" available={true} />
            <Card type="Fornada" available={false} />
            <Card type="Fornada" available={true} />
            <Card type="Fornada" available={true} />
          </div>
          <ArrowButton direction="right" />
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;