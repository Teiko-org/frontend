import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import Button from "../../components/Button";
import { getAllDecoracoes } from "../../service/decoracaoService";

function Carambolos() {
  const location = useLocation();
  const navigate = useNavigate();
  const categoriaSelecionada = location.state?.categoriaSelecionada;
  
  const [decoracoesPorCategoria, setDecoraceoesPorCategoria] = React.useState({});
  const [pageByCategory, setPageByCategory] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [scrollToCategory, setScrollToCategory] = React.useState(null);
  const CARDS_PER_PAGE = 4;
  
  // Refs para as seções de categoria
  const categoryRefs = useRef({});

  React.useEffect(() => {
    const fetchDecoracoes = async () => {
      try {
        setLoading(true);
        const data = await getAllDecoracoes();
        
        // Agrupa decorações por categoria
        const agrupadas = data.reduce((acc, decoracao) => {
          const categoria = decoracao.categoria || 'Outros';
          if (!acc[categoria]) acc[categoria] = [];
          acc[categoria].push(decoracao);
          return acc;
        }, {});
        
        setDecoraceoesPorCategoria(agrupadas);
        
        const initialPages = {};
        Object.keys(agrupadas).forEach(cat => { initialPages[cat] = 0; });
        setPageByCategory(initialPages);
        
        // Se uma categoria foi selecionada, marca para scroll
        if (categoriaSelecionada) {
          const categoriaNormalizada = categoriaSelecionada.trim();
          const categoriaEncontrada = Object.keys(agrupadas).find(
            cat => cat && cat.trim().toLowerCase() === categoriaNormalizada.toLowerCase()
          );
          if (categoriaEncontrada) {
            setScrollToCategory(categoriaEncontrada);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar decorações:", error);
        setDecoraceoesPorCategoria({});
      } finally {
        setLoading(false);
      }
    };
    
    fetchDecoracoes();
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
  }, [scrollToCategory, decoracoesPorCategoria]);

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
        <div className="text-2xl text-blue">Carregando decorações...</div>
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
        
        {Object.keys(decoracoesPorCategoria).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              Nenhuma decoração cadastrada no momento.
            </p>
          </div>
        ) : (
          Object.keys(decoracoesPorCategoria).map((categoria) =>
            renderSection(
              categoria,
              decoracoesPorCategoria[categoria],
              pageByCategory[categoria] || 0,
              (dir) => dir === 'left' ? handlePrev(categoria) : handleNext(categoria, decoracoesPorCategoria[categoria].length),
              categoriaSelecionada === categoria,
              categoryRefs,
              navigate
            )
          )
        )}
      </section>
      <Footer />
    </div>
  );
}

const renderSection = (title, decoracoes, page, onArrowClick, isSelected, categoryRefs, navigate) => {
  const CARDS_PER_PAGE = 4;
  const startIdx = page * CARDS_PER_PAGE;
  const endIdx = startIdx + CARDS_PER_PAGE;
  const paginatedDecoracoes = decoracoes.slice(startIdx, endIdx);
  
  const handleCardClick = (decoracao) => {
    navigate('/pedido-bolo', { state: { decoracao } });
  };
  
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
            {paginatedDecoracoes && paginatedDecoracoes.length > 0 ? (
              paginatedDecoracoes.map((decoracao) => (
                <div
                  key={decoracao.id}
                  className="relative rounded-lg overflow-hidden border border-gold bg-white cursor-pointer transition-all duration-500 hover:scale-105 shadow-lg flex-none"
                  style={{ width: '280px' }}
                  onClick={() => handleCardClick(decoracao)}
                >
                  <img
                    src={decoracao.imagens?.[0] || 'https://via.placeholder.com/256'}
                    alt={decoracao.nome}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-full flex justify-center px-2">
                    <span
                      title={decoracao.nome}
                      className="inline-block rounded-[12px] border border-[#D4B076] shadow-[0_4px_12px_rgba(0,0,0,0.16)] backdrop-blur-sm font-montserrat font-normal whitespace-nowrap overflow-hidden text-ellipsis leading-tight px-5 py-2 text-[clamp(12px,1.1vw,16px)] max-w-[88%]"
                      style={{
                        background: 'rgba(255, 232, 196, 0.8)',
                        color: '#8A541C',
                      }}
                    >
                      {decoracao.nome}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma decoração disponível nesta categoria.
              </div>
            )}
          </div>
          <ArrowButton 
            direction="right" 
            onClick={() => onArrowClick('right')} 
            disabled={endIdx >= decoracoes.length} 
          />
        </div>
      </section>
      <div className="h-24"></div>
    </React.Fragment>
  );
};

export default Carambolos;