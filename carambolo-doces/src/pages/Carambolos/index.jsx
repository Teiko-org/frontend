import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import Button from "../../components/Button";
import { getBolosComImagens } from "../../service/boloService";

function Carambolos() {
  const [bolosPorCategoria, setBolosPorCategoria] = React.useState({});
  const [pageByCategory, setPageByCategory] = React.useState({});
  const CARDS_PER_PAGE = 4;

  React.useEffect(() => {
    const fetchBolos = async () => {
      try {
        const data = await getBolosComImagens();
        const agrupados = data.reduce((acc, bolo) => {
          const categoria = bolo.categoria || 'Outros';
          if (!acc[categoria]) acc[categoria] = [];
          acc[categoria].push(bolo);
          return acc;
        }, {});
        
        if (Object.keys(agrupados).length === 0) {
          const categoriasDefault = [
            'CARAMBOLOS MAIS PEDIDOS',
            'CARAMBOLOS VINTAGE', 
            'CARAMBOLOS BIRTHDAY',
            'CARAMBOLOS ESTAMPADOS',
            'MONTE O SEU CARAMBOLO'
          ];
          categoriasDefault.forEach(cat => {
            agrupados[cat] = [];
          });
        }
        
        setBolosPorCategoria(agrupados);
        const initialPages = {};
        Object.keys(agrupados).forEach(cat => { initialPages[cat] = 0; });
        setPageByCategory(initialPages);
      } catch (error) {
        console.error("Erro ao carregar bolos:", error);
        const categoriasDefault = [
          'CARAMBOLOS MAIS PEDIDOS',
          'CARAMBOLOS VINTAGE', 
          'CARAMBOLOS BIRTHDAY',
          'CARAMBOLOS ESTAMPADOS',
          'MONTE O SEU CARAMBOLO'
        ];
        const agrupados = {};
        categoriasDefault.forEach(cat => {
          agrupados[cat] = [];
        });
        setBolosPorCategoria(agrupados);
        
        const initialPages = {};
        categoriasDefault.forEach(cat => { initialPages[cat] = 0; });
        setPageByCategory(initialPages);
      }
    };
    fetchBolos();
  }, []);

  const handlePrev = (categoria) => {
    setPageByCategory(prev => ({
      ...prev,
      [categoria]: Math.max(0, prev[categoria] - 1)
    }));
  };

  const handleNext = (categoria, bolosLength) => {
    setPageByCategory(prev => ({
      ...prev,
      [categoria]: Math.min(
        prev[categoria] + 1,
        Math.floor((bolosLength - 1) / CARDS_PER_PAGE)
      )
    }));
  };

  return (
    <div className="bg-bgNativeHome">
      <Header />
      <section className="pt-8 bg-bgNativeHome border-t border-b border-gold">
        <h2 className="text-start text-4xl font-bold mb-6 ml-24">
          CARAMBOLOS PRÉ-DECORADOS
        </h2>
        {Object.keys(bolosPorCategoria).map((categoria) =>
          renderSection(
            categoria,
            bolosPorCategoria[categoria],
            pageByCategory[categoria] || 0,
            (dir) => dir === 'left' ? handlePrev(categoria) : handleNext(categoria, bolosPorCategoria[categoria].length)
          )
        )}
      </section>
      <Footer />
    </div>
  );
}

const renderSection = (title, bolos, page, onArrowClick) => {
  const CARDS_PER_PAGE = 4;
  const startIdx = page * CARDS_PER_PAGE;
  const endIdx = startIdx + CARDS_PER_PAGE;
  const paginatedBolos = bolos.slice(startIdx, endIdx);
  
  return (
    <React.Fragment key={title}>
      <section className="pb-16 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-3xl font-medium mb-6 mt-6">{title}</h2>
        <div className="flex justify-between items-center px-4">
          <ArrowButton 
            direction="left" 
            onClick={() => onArrowClick('left')} 
            disabled={page === 0} 
          />
          <div className="flex space-x-12">
            {paginatedBolos && paginatedBolos.length > 0 ? (
              paginatedBolos.map((bolo) => (
                <Card
                  key={bolo.boloId ?? bolo.id}
                  type="Bolo"
                  nome={bolo.produto}
                  preco={bolo.precoTotal}
                  boloData={bolo}
                />
              ))
            ) : (
              <>
                <Card key={`${title}-placeholder-1`} type="Bolo" />
                <Card key={`${title}-placeholder-2`} type="Bolo" />
                <Card key={`${title}-placeholder-3`} type="Bolo" />
                <Card key={`${title}-placeholder-4`} type="Bolo" />
              </>
            )}
          </div>
          <ArrowButton 
            direction="right" 
            onClick={() => onArrowClick('right')} 
            disabled={endIdx >= bolos.length} 
          />
        </div>
      </section>
      <div className="h-24"></div>
    </React.Fragment>
  );
};

export default Carambolos;