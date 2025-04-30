import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import BannerFornada from "../../components/BannerFornada";

function FornadaSemana() {
  return (
    <div className="bg-bgNativeHome">
      <Header />
      <BannerFornada/>
      <section className="pt-8 pb-16 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          FORNADA DA SEMANA
        </h2>
        <div className="grid grid-cols-4 gap-12 px-24">
          <Card type="Fornada" available={true} />
          <Card type="Fornada" available={false} />
          <Card type="Fornada" available={true} />
          <Card type="Fornada" available={true} />
          <Card type="Fornada" available={true} />
          <Card type="Fornada" available={true} />
          <Card type="Fornada" available={false} />
          <Card type="Fornada" available={true} />
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default FornadaSemana;