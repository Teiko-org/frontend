import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import { FaArrowRight } from "react-icons/fa";
import Button from "../../components/Button";

function Home() {
  return (
    <div className="bg-bgNativeHome">
      <Header />

      {/* Banner Section */}
      <section className="relative h-[450px] bg-white">
        <div className="absolute inset-0 flex items-center justify-end px-24">
          <div className="relative">
            <img
              src="src/assets/banner_card.png"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-transparent">
              <p className="text-center text-xl px-16 py-4   bg-blueMedium">
                Na carambolo você pode personalizar o seu bolo para ficar com a
                sua cara!
              </p>
            </div>
            <div className="absolute inset-0 flex justify-center items-end pb-10">
            <button className="flex items-center space-x-2 justify-center bg-gradient-to-l from-gold to-darkGold text-blue font-bold border-gold border-2 py-2 px-6 rounded-full shadow-lg">
              <span className="uppercase">Ver Temas</span>
              <span>
                <FaArrowRight />
              </span>
            </button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-12"></div>

      {/* Banner Fornada de Natal */}
      <section className="h-[150px] w-10/12 bg-black m-auto flex justify-center items-center">
        <div className="text-white text-center">
          <h2 className="text-xl">Fornada de Natal</h2>
        </div>
      </section>

      {/* Spacer */}
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

      {/* Spacer */}
      <div className="h-24"></div>

      {/* Carambolos Mais Pedidos */}
      <section className="pt-8 pb-16 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          CARAMBOLOS MAIS PEDIDOS
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
      </section>

      {/* Spacer */}
      <div className="h-24"></div>

      {/* Fornada da Semana */}
      <section className="pt-8 pb-16 bg-bgHome border-t border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          FORNADA DA SEMANA
        </h2>
        <div className="flex justify-between items-center px-4">
          <ArrowButton direction="left" />
          <div className="flex space-x-6">
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
