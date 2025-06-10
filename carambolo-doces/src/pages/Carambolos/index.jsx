import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import Button from "../../components/Button";
import { getBolosPorCategoria } from "../../service/boloService";

function Carambolos() {
  const [bolosPorCategoria, setBolosPorCategoria] = React.useState({});
  // Estado para controlar a página de cada categoria
  const [pageByCategory, setPageByCategory] = React.useState({});
  const CARDS_PER_PAGE = 3;

  React.useEffect(() => {
    const fetchBolos = async () => {
      const data = await getBolosPorCategoria();
      // Agrupa por categoria
      const agrupados = data.reduce((acc, bolo) => {
        const categoria = bolo.categoria || 'Outros';
        if (!acc[categoria]) acc[categoria] = [];
        acc[categoria].push(bolo);
        return acc;
      }, {});
      setBolosPorCategoria(agrupados);
      // Inicializa a página de cada categoria em 0
      const initialPages = {};
      Object.keys(agrupados).forEach(cat => { initialPages[cat] = 0; });
      setPageByCategory(initialPages);
    };
    fetchBolos();
  }, []);

  // Handlers para navegação
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
            bolosPorCategoria[categoria][0]?.categoria || categoria,
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

// Adapta renderSection para receber página e handler
const renderSection = (title, bolos, page, onArrowClick) => {
  const CARDS_PER_PAGE = 3;
  const startIdx = page * CARDS_PER_PAGE;
  const endIdx = startIdx + CARDS_PER_PAGE;
  const paginatedBolos = bolos.slice(startIdx, endIdx);
  return (
    <section className="pb-16 bg-bgHome border-t border-b border-gold mt-24" key={title}>
      <h2 className="text-center text-3xl font-medium mb-6 mt-6">{title}</h2>
      <div className="flex justify-between items-center px-4">
        <ArrowButton direction="left" onClick={() => onArrowClick('left')} disabled={page === 0} />
        <div className="flex space-x-12">
          {paginatedBolos && paginatedBolos.length > 0 ? (
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
        <ArrowButton direction="right" onClick={() => onArrowClick('right')} disabled={endIdx >= bolos.length} />
      </div>
    </section>
  );
};

export default Carambolos;