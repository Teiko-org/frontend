import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Carousel from "../../components/Carousel";
import { getAllDecoracoes } from "../../service/decoracaoService";
import defaultImageCard from "../../assets/image_card.png";

function Carambolos() {
  const location = useLocation();
  const navigate = useNavigate();
  const categoriaSelecionada = location.state?.categoriaSelecionada;
  
  const [decoracoesPorCategoria, setDecoraceoesPorCategoria] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [scrollToCategory, setScrollToCategory] = React.useState(null);
  
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
        <h2 className="text-center text-4xl font-medium mb-6">
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
              navigate
            )
          )
        )}
      </section>
      <Footer />
    </div>
  );
}

const renderSection = (title, decoracoes, navigate) => {
  const slides = decoracoes.map(decoracao => ({
    id: decoracao.id,
    title: decoracao.nome,
    image: decoracao.imagens?.[0] || defaultImageCard,
    decoracao: decoracao
  }));

  const handleSlideClick = (slide) => {
    navigate('/pedido-bolo', { state: { decoracao: slide.decoracao } });
  };

  return (
    <React.Fragment key={title}>
      <section className="pt-8 pb-8 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-3xl font-medium mb-6">
          {title}
        </h2>
        <div className="px-6">
          <Carousel 
            slides={slides}
            autoPlay={true}
            interval={3500}
            showIndicators={false}
            itemsPerView={3}
            showTitles={true}
            onSlideClick={handleSlideClick}
          />
        </div>
      </section>
      <div className="h-24"></div>
    </React.Fragment>
  );
};

export default Carambolos;