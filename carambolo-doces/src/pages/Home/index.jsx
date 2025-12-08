import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import ArrowButton from "../../components/ButtonArrow";
import Button from "../../components/Button";
import BannerPrincipal from "../../components/BannerPrincipal";
import BannerFornada from "../../components/BannerFornada";
import { getFornadaRealmenteAtiva, getFornadaAtiva, getProdutosFornadaComImagens } from "../../service/fornadaService";
import { getAllDecoracoes } from "../../service/decoracaoService";
import Carousel from "../../components/Carousel";
import defaultImageCard from "../../assets/image_card.png";
import './cardsTransition.css';

function Home() {
  const [decoracoes, setDecoracoes] = useState([]);
  const [produtosFornada, setProdutosFornada] = useState([]);
  const [fornadaParaBanner, setFornadaParaBanner] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q')?.trim().toLowerCase() || '';

  useEffect(() => {
    const fetchDecoracoes = async () => {
      try {
        const data = await getAllDecoracoes();
        // Group decorações by categoria and create slides
        const groupedByCategoria = {};
        (data || []).forEach((decoracao) => {
          const categoria = decoracao.categoria || 'Sem Categoria';
          if (!groupedByCategoria[categoria]) {
            groupedByCategoria[categoria] = [];
          }
          groupedByCategoria[categoria].push({
            id: decoracao.id,
            nome: decoracao.nome,
            image: decoracao.imagens?.[0] || defaultImageCard,
            observacao: decoracao.observacao,
            categoria: decoracao.categoria,
            title: decoracao.nome,
          });
        });
        
        // Create a flat array of slides with categoria info
        const slides = Object.entries(groupedByCategoria).flatMap(([categoria, items]) =>
          items.map(item => ({
            ...item,
            categoria,
          }))
        );
        
        setDecoracoes(slides);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.warn("Erro ao carregar decorações:", error.message);
        }
        setDecoracoes([]);
      }
    };
    
    const carregarDadosFornada = async () => {
      try {
        const fornadaParaBanner = await getFornadaAtiva();
        setFornadaParaBanner(fornadaParaBanner);
        
        const fornadaAtual = await getFornadaRealmenteAtiva();
        
        if (fornadaAtual) {
          const produtos = await getProdutosFornadaComImagens(fornadaAtual.id);
          const visiveis = (produtos || []).filter(p => (p.quantidade ?? 0) > 0 && (p.isAtivo ?? true));
          setProdutosFornada(visiveis.slice(0, 4));
        } else {
          setProdutosFornada([]);
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.warn("Erro ao carregar dados da fornada:", error.message);
        }
        setFornadaParaBanner(null);
        setProdutosFornada([]);
      }
    };

    fetchDecoracoes();
    carregarDadosFornada();
  }, []);

  const slides = useMemo(() => {
    const base = decoracoes;
    if (!base || base.length === 0) return [];
    if (!searchQuery) return base;
    const q = searchQuery;
    if (q.includes('fornada')) return [];
    if (q.includes('carambolo') || q.includes('bolo')) return base;
    return base.filter(s => (s.title || '').toLowerCase().includes(q));
  }, [decoracoes, searchQuery]);

  const showCarambolos = !searchQuery || searchQuery.includes('carambolo') || searchQuery.includes('bolo');
  const showFornada = !searchQuery || searchQuery.includes('fornada');

  const handleTemaClick = (slide) => {
    if (slide.categoria) {
      navigate('/carambolos', { state: { categoriaSelecionada: slide.categoria } });
    }
  };

  const handleVerMaisTemas = () => {
    navigate('/carambolos');
  };

  return (
    <div className="bg-bgNativeHome min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">        
      <BannerPrincipal />
      <div className="h-12"></div>
      
      {/* Banner de Fornada - sempre visível; se não houver fornada, BannerFornada se auto-ajusta */}
      <BannerFornada fornada={fornadaParaBanner} />
      <div className="h-12"></div>
      
      {/* Carambolos Pré-Decorados - com carrossel */}
      {showCarambolos && (
      <section className="pt-8 pb-8 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          CARAMBOLOS PRÉ-DECORADOS
        </h2>
        
        {slides.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg mx-auto mb-4 w-64"></div>
              <p className="text-xl text-gray-600 mb-4">
                {searchQuery ? 'Nenhum resultado para sua busca.' : 'Carregando temas disponíveis...'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6">
              <Carousel 
                slides={slides} 
                autoPlay 
                interval={3500}
                onSlideClick={handleTemaClick}
              />
            </div>
            <div className="h-10"></div>
            <div className="flex justify-center">
              <Button
                text="Ver mais temas"
                bgColor="bg-gradient-to-l from-gold to-darkGold"
                fontSize="text-lg"
                textColor="text-blue"
                borderColor="border-gold"
                onClick={handleVerMaisTemas}
              />
            </div>
          </>
        )}
      </section>
      )}

      {/* Espaço consistente entre seções */}
      <div className="h-24"></div>

      {/* Espaço consistente entre seções (mostra apenas se houver Fornada) */}
      {showFornada && <div className="h-24"></div>}

      {/* Fornada da Semana */}
      {showFornada && (
      <section className="pt-8 pb-16 bg-bgHome border-t border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          FORNADA DA SEMANA
        </h2>
        
        {produtosFornada.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 mb-2">
              Não há uma fornada rolando no momento
            </p>
            <p className="text-sm text-gray-500">
              Fique atento às nossas redes sociais para saber quando será a próxima!
            </p>
          </div>
        ) : (
          <div className="flex justify-between items-center px-4">
            <ArrowButton direction="left" />
            <div className="flex space-x-14">
              {produtosFornada.map((produto) => (
                <Card
                  key={produto.fornadaDaVezId}
                  type="Fornada"
                  available={produto.quantidade > 0 && produto.isAtivo}
                  produto={produto}
                />
              ))}
            </div>
            <ArrowButton direction="right" />
          </div>
        )}
      </section>
      )}

      {searchQuery && !showCarambolos && !showFornada && (
        <section className="pt-8 pb-16 bg-bgHome border-t border-gold">
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Nenhum resultado para "{searchQuery}"</p>
          </div>
        </section>
      )}
      </main>
      <Footer />
    </div>
  );
}

export default Home;