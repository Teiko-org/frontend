import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import Button from "../../components/Button";
import { getBolosComImagens } from "../../service/boloService";

function Carambolos() {
  const location = useLocation();
  const navigate = useNavigate();
  const categoriaSelecionada = location.state?.categoriaSelecionada;
  
  const [bolosPorCategoria, setBolosPorCategoria] = React.useState({});
  const [pageByCategory, setPageByCategory] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [scrollToCategory, setScrollToCategory] = React.useState(null);
  const CARDS_PER_PAGE = 4;
  
  // Refs para as seções de categoria
  const categoryRefs = useRef({});

  React.useEffect(() => {
    const fetchBolos = async () => {
      try {
        setLoading(true);
        const data = await getBolosComImagens();
        
        // Comportamento original: agrupa por categoria
        const agrupados = data.reduce((acc, bolo) => {
          const categoria = bolo.categoria || 'Outros';
          if (!acc[categoria]) acc[categoria] = [];
          acc[categoria].push(bolo);
          return acc;
        }, {});
        
        setBolosPorCategoria(agrupados);
        
        const initialPages = {};
        Object.keys(agrupados).forEach(cat => { initialPages[cat] = 0; });
        setPageByCategory(initialPages);
        
        // Se uma categoria foi selecionada, marca para scroll
        if (categoriaSelecionada) {
          const categoriaNormalizada = categoriaSelecionada.trim();
          const categoriaEncontrada = Object.keys(agrupados).find(
            cat => cat && cat.trim().toLowerCase() === categoriaNormalizada.toLowerCase()
          );
          if (categoriaEncontrada) {
            setScrollToCategory(categoriaEncontrada);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar bolos:", error);
        setBolosPorCategoria({});
      } finally {
        setLoading(false);
      }
    };
    
    fetchBolos();
  }, [categoriaSelecionada]);

  // Effect para fazer scroll para a categoria selecionada
  React.useEffect(() => {
    if (scrollToCategory && categoryRefs.current[scrollToCategory]) {
      setTimeout(() => {
        categoryRefs.current[scrollToCategory].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        setScrollToCategory(null);
      }, 100);
    }
  }, [scrollToCategory, bolosPorCategoria]);

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

  if (loading) {
    return (
      <div className="bg-bgNativeHome min-h-screen flex items-center justify-center">
        <div className="text-2xl text-blue">Carregando bolos...</div>
      </div>
    );
  }

  return (
    <div className="bg-bgNativeHome">
      <Header />
      <section className="pt-8 bg-bgNativeHome border-t border-b border-gold">
        <h2 className="text-start text-4xl font-bold mb-6 ml-24">
          CARAMBOLOS PRÉ-DECORADOS
        </h2>
        
        {Object.keys(bolosPorCategoria).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              Nenhum bolo cadastrado no momento.
            </p>
          </div>
        ) : (
          Object.keys(bolosPorCategoria).map((categoria) =>
            renderSection(
              categoria,
              bolosPorCategoria[categoria],
              pageByCategory[categoria] || 0,
              (dir) => dir === 'left' ? handlePrev(categoria) : handleNext(categoria, bolosPorCategoria[categoria].length),
              categoriaSelecionada === categoria,
              categoryRefs
            )
          )
        )}
      </section>
      <Footer />
    </div>
  );
}

const renderSection = (title, bolos, page, onArrowClick, isSelected, categoryRefs) => {
  const CARDS_PER_PAGE = 4;
  const startIdx = page * CARDS_PER_PAGE;
  const endIdx = startIdx + CARDS_PER_PAGE;
  const paginatedBolos = bolos.slice(startIdx, endIdx);
  
  return (
    <React.Fragment key={title}>
      <section 
        ref={el => categoryRefs.current[title] = el}
        className={`pb-16 bg-bgHome border-t border-b border-gold ${isSelected ? 'ring-4 ring-gold ring-opacity-50' : ''}`}
      >
        <h2 className="text-center text-3xl font-medium mb-6 mt-6">
          {title}
        </h2>
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
              <div className="text-center py-8 text-gray-500">
                Nenhum bolo disponível nesta categoria.
              </div>
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