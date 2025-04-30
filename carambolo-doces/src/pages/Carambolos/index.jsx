import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import Button from "../../components/Button";

function Carambolos() {
  return (
    <div className="bg-bgNativeHome">
      <Header />

      <section className="pt-8 bg-bgNativeHome border-t border-b border-gold">
        <h2 className="text-start text-4xl font-bold mb-6 ml-24">
          CARAMBOLOS PRÉ-DECORADOS
        </h2>
        {renderSection("CARAMBOLOS MAIS PEDIDOS")}
        {renderSection("CARAMBOLOS VINTAGE")}
        {renderSection("CARAMBOLOS BIRTHDAY")}
        {renderSection("CARAMBOLOS ESTAMPADOS")}
        {renderSection("MONTE O SEU CARAMBOLO")}
      </section>

      <Footer />
    </div>
  );
}

const renderSection = (title) => (
  <section className="pb-16 bg-bgHome border-t border-b border-gold">
    <h2 className="text-center text-3xl font-medium mb-6 mt-6">{title}</h2>
    <div className="flex justify-between items-center px-4">
      <ArrowButton direction="left" />
      <div className="flex space-x-12">
        <Card type="Bolo" />
        <Card type="Bolo" />
        <Card type="Bolo" />
        <Card type="Bolo" />
      </div>
      <ArrowButton direction="right" />
    </div>
  </section>
);

export default Carambolos;