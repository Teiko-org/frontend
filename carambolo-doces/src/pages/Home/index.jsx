import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import Button from "../../components/Button";
import BannerPrincipal from "../../components/BannerPrincipal";
import BannerFornada from "../../components/BannerFornada";
import { getFornadaRealmenteAtiva, getFornadaAtiva, getProdutosFornadaComImagens } from "../../service/fornadaService";
import { getAllDecoracoes } from "../../service/decoracaoService";
import { getBolosMaisPedidos } from "../../service/dashboardService";
import { getBolosComImagens } from "../../service/boloService";
import Carousel from "../../components/Carousel";
import defaultImageCard from "../../assets/image_card.png";
import './cardsTransition.css';

// Componente Carousel customizado para Bolos Mais Pedidos
function BolosMaisPedidosCarousel({ bolos }) {
  const [current, setCurrent] = useState(0);
  const itemsPerView = 4;
  // Ajustar a largura do card baseado no número de itens
  const cardWidthPercent = bolos.length <= itemsPerView 
    ? 100 / Math.max(bolos.length, 1) - 2 // Se há poucos itens, distribuir melhor o espaço
    : 24; // Se há muitos itens, usar 24% (4 por view)
  const timerRef = useRef(null);

  const previous = () => {
    setCurrent((prev) => (prev === 0 ? bolos.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrent((prev) => (prev === bolos.length - 1 ? 0 : prev + 1));
  };

  // Auto-play opcional
  useEffect(() => {
    if (bolos.length <= 1) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev === bolos.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [bolos.length]);

  const translatePercent = useMemo(() => {
    // Se há poucos itens, não precisa fazer scroll
    if (bolos.length <= itemsPerView) {
      return 0;
    }
    
    const totalWidth = bolos.length * cardWidthPercent;
    const lastVisibleIndex = bolos.length - itemsPerView;
    
    // Quando chegamos nos últimos itens, garantir que o último item seja totalmente visível
    if (current >= lastVisibleIndex) {
      const lastItemIndex = bolos.length - 1;
      const lastItemStart = lastItemIndex * cardWidthPercent;
      // O último item precisa terminar dentro de 100%, mas com espaço para o padding
      // Considerar que temos paddingRight de 3rem (~48px), que é aproximadamente 3-4% da largura
      const paddingPercent = 4; // Aproximação do padding em percentual
      const maxTranslate = lastItemStart + cardWidthPercent - 100 + paddingPercent;
      return Math.max(0, maxTranslate);
    }
    
    // Para itens no meio, centralizar normalmente
    let desired = current * cardWidthPercent + cardWidthPercent / 2 - 50;
    const maxTranslate = Math.max(0, totalWidth - 100);
    return Math.min(Math.max(desired, 0), maxTranslate);
  }, [current, bolos.length, cardWidthPercent, itemsPerView]);

  return (
    <div className="relative w-full pb-8" style={{ overflow: 'visible' }}>
      <style>{`
        .bolos-carousel-container::-webkit-scrollbar {
          display: none;
        }
        .bolos-carousel-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div
        className="flex transition-transform ease-out duration-500 gap-x-6 px-6 md:px-12 py-4 bolos-carousel-container"
        style={{ 
          transform: `translateX(-${translatePercent}%)`, 
          overflow: 'visible',
          paddingRight: '3rem'
        }}
      >
        {bolos.map((bolo, index) => {
          const isCenter = index === current;
          const cardClasses = isCenter
            ? "scale-[1.02] translate-y-3 z-20 shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
            : "scale-[0.98] -translate-y-1 z-10 opacity-95 shadow-[0_6px_14px_rgba(0,0,0,0.12)]";

          // Extrair URL da imagem de diferentes formatos possíveis
          let imagemUrl = defaultImageCard;
          if (bolo.imagens && bolo.imagens.length > 0) {
            const primeiraImagem = bolo.imagens[0];
            imagemUrl = typeof primeiraImagem === 'string' 
              ? primeiraImagem 
              : primeiraImagem?.url || primeiraImagem;
          } else if (bolo.decoracao?.imagens && bolo.decoracao.imagens.length > 0) {
            const primeiraImagem = bolo.decoracao.imagens[0];
            imagemUrl = typeof primeiraImagem === 'string' 
              ? primeiraImagem 
              : primeiraImagem?.url || primeiraImagem;
          }
          
          const nome = bolo.decoracao?.nome || bolo.nome || 'Carambolo';
          const preco = bolo.precoTotal || bolo.preco || bolo.valorTotal || 0;

          return (
            <div
              key={bolo.id}
              className="flex-none flex justify-center"
              style={{ 
                width: bolos.length <= itemsPerView 
                  ? `${100 / Math.max(bolos.length, 1)}%` 
                  : `${cardWidthPercent}%`, 
                overflow: 'visible', 
                padding: '8px',
                maxWidth: bolos.length <= itemsPerView ? '280px' : 'none'
              }}
            >
              <div className={`transition-all duration-500 ${cardClasses}`} style={{ overflow: 'visible' }}>
                <Card
                  type="Bolo"
                  nome={nome}
                  preco={preco}
                  imagem={imagemUrl}
                  boloData={bolo}
                  available={true}
                />
              </div>
            </div>
          );
        })}
      </div>

      {bolos.length > itemsPerView && (
        <>
          <button
            aria-label="anterior"
            onClick={previous}
            className="absolute top-1/2 -translate-y-1/2 z-40 text-3xl text-gold hover:scale-110 transition-transform"
            style={{ left: '16px' }}
          >
            <BsFillArrowLeftCircleFill />
          </button>
          <button
            aria-label="próximo"
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 z-40 text-3xl text-gold hover:scale-110 transition-transform"
            style={{ right: '16px' }}
          >
            <BsFillArrowRightCircleFill />
          </button>
        </>
      )}
    </div>
  );
}

// Componente Carousel customizado para Fornada da Semana - usando a mesma animação do Carousel original
function FornadaCarousel({ produtos }) {
  const [current, setCurrent] = useState(0);
  const itemsPerView = 4;
  const cardWidthPercent = 24; // Mesmo valor usado no Carousel original para 4 itens
  const timerRef = useRef(null);

  const previous = () => {
    setCurrent((prev) => (prev === 0 ? produtos.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrent((prev) => (prev === produtos.length - 1 ? 0 : prev + 1));
  };

  // Auto-play opcional (pode ser desabilitado se preferir)
  useEffect(() => {
    if (produtos.length <= 1) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev === produtos.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [produtos.length]);

  const translatePercent = useMemo(() => {
    if (produtos.length <= itemsPerView) {
      // Se temos menos ou igual itens que o viewport, não precisa fazer scroll
      return 0;
    }
    
    const totalWidth = produtos.length * cardWidthPercent;
    const lastVisibleIndex = produtos.length - itemsPerView;
    
    // Quando chegamos nos últimos itens, garantir que o último item seja totalmente visível
    if (current >= lastVisibleIndex) {
      // Calcular a posição para mostrar os últimos itemsPerView itens
      // O último item (índice produtos.length - 1) deve estar completamente visível
      const lastItemIndex = produtos.length - 1;
      const lastItemStart = lastItemIndex * cardWidthPercent;
      // O último item precisa terminar dentro de 100%, mas com espaço para o padding
      const paddingPercent = 4; // Aproximação do padding em percentual
      const maxTranslate = lastItemStart + cardWidthPercent - 100 + paddingPercent;
      return Math.max(0, maxTranslate);
    }
    
    // Para itens no meio, centralizar normalmente
    let desired = current * cardWidthPercent + cardWidthPercent / 2 - 50;
    const maxTranslate = Math.max(0, totalWidth - 100);
    return Math.min(Math.max(desired, 0), maxTranslate);
  }, [current, produtos.length, cardWidthPercent, itemsPerView]);

  return (
    <div className="relative w-full pb-8" style={{ overflow: 'hidden' }}>
      <style>{`
        .fornada-carousel-container::-webkit-scrollbar {
          display: none;
        }
        .fornada-carousel-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div
        className="flex transition-transform ease-out duration-500 gap-x-6 px-6 md:px-12 py-4 fornada-carousel-container"
        style={{ 
          transform: `translateX(-${translatePercent}%)`, 
          overflow: 'visible',
          paddingRight: '3rem'
        }}
      >
        {produtos.map((produto, index) => {
          const isCenter = index === current;
          const cardClasses = isCenter
            ? "scale-[1.02] translate-y-3 z-20 shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
            : "scale-[0.98] -translate-y-1 z-10 opacity-95 shadow-[0_6px_14px_rgba(0,0,0,0.12)]";

          return (
            <div
              key={produto.fornadaDaVezId || produto.id}
              className="flex-none flex justify-center"
              style={{ width: `${cardWidthPercent}%`, overflow: 'visible', padding: '8px' }}
            >
              <div className={`transition-all duration-500 ${cardClasses}`} style={{ overflow: 'visible' }}>
                <Card
                  type="Fornada"
                  available={produto.quantidade > 0 && produto.isAtivo}
                  produto={produto}
                />
              </div>
            </div>
          );
        })}
      </div>

      {produtos.length > itemsPerView && (
        <>
          <button
            aria-label="anterior"
            onClick={previous}
            className="absolute top-1/2 -translate-y-1/2 z-40 text-3xl text-gold hover:scale-110 transition-transform"
            style={{ left: '16px' }}
          >
            <BsFillArrowLeftCircleFill />
          </button>
          <button
            aria-label="próximo"
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 z-40 text-3xl text-gold hover:scale-110 transition-transform"
            style={{ right: '16px' }}
          >
            <BsFillArrowRightCircleFill />
          </button>
        </>
      )}
    </div>
  );
}

function Home() {
  const [decoracoes, setDecoracoes] = useState([]);
  const [produtosFornada, setProdutosFornada] = useState([]);
  const [fornadaParaBanner, setFornadaParaBanner] = useState(null);
  const [bolosMaisPedidos, setBolosMaisPedidos] = useState([]);
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
          // Mostrar TODOS os produtos, não apenas 4
          setProdutosFornada(visiveis);
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

    const carregarBolosMaisPedidos = async () => {
      try {
        const bolosMaisPedidosData = await getBolosMaisPedidos();
        console.log("🔍 Bolos mais pedidos recebidos da API:", bolosMaisPedidosData);
        
        if (bolosMaisPedidosData && Array.isArray(bolosMaisPedidosData) && bolosMaisPedidosData.length > 0) {
          // Buscar os detalhes completos dos bolos com imagens
          const todosBolos = await getBolosComImagens();
          console.log("📦 Total de bolos disponíveis:", todosBolos.length);
          
          const bolosComDetalhes = bolosMaisPedidosData
            .map(bmp => {
              // O backend retorna: { boloId, quantidade, nome, valorTotal }
              const boloId = bmp.boloId || bmp.id;
              const quantidadePedidos = bmp.quantidade || bmp.quantidadePedidos || 0;
              
              if (!boloId) {
                console.warn("⚠️ Bolo sem ID encontrado:", bmp);
                return null;
              }
              
              // Tentar encontrar o bolo completo na lista
              const boloCompleto = todosBolos.find(b => {
                const matchId = b.id === boloId || b.id === parseInt(boloId);
                return matchId;
              });
              
              if (boloCompleto) {
                // Usar dados do bolo completo, mas manter quantidadePedidos e dados da API
                return {
                  ...boloCompleto,
                  quantidadePedidos: quantidadePedidos,
                  // Usar nome da API se disponível, senão do bolo completo
                  nome: bmp.nome || boloCompleto.decoracao?.nome || boloCompleto.nome || 'Carambolo',
                  // Usar valorTotal da API se disponível, senão do bolo completo
                  precoTotal: bmp.valorTotal || boloCompleto.precoTotal || boloCompleto.preco || 0,
                  // Garantir que temos imagens do bolo completo
                  imagens: boloCompleto.imagens || []
                };
              } else {
                // Se não encontrou na lista completa, criar objeto básico com dados da API
                console.warn(`⚠️ Bolo ID ${boloId} não encontrado na lista completa, criando objeto básico`);
                return {
                  id: boloId,
                  nome: bmp.nome || 'Carambolo',
                  precoTotal: bmp.valorTotal || 0,
                  quantidadePedidos: quantidadePedidos,
                  imagens: [] // Sem imagens se não encontrou o bolo completo
                };
              }
            })
            .filter(Boolean)
            .slice(0, 8); // Limitar a 8 bolos mais pedidos
          
          console.log("✅ Bolos processados e prontos para exibir:", bolosComDetalhes.length, bolosComDetalhes);
          setBolosMaisPedidos(bolosComDetalhes);
        } else {
          console.log("ℹ️ Nenhum bolo mais pedido encontrado ou array vazio");
          setBolosMaisPedidos([]);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar bolos mais pedidos:", error);
        if (error.response?.status !== 401) {
          console.warn("Erro detalhado:", error.response?.data || error.message);
        }
        setBolosMaisPedidos([]);
      }
    };

    fetchDecoracoes();
    carregarDadosFornada();
    carregarBolosMaisPedidos();
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

      {/* Carambolos Mais Pedidos */}
      {bolosMaisPedidos.length > 0 && (
        <section className="pt-8 pb-16 bg-bgHome border-t border-gold" style={{ overflow: 'visible' }}>
          <h2 className="text-center text-4xl font-medium mb-6">
            CARAMBOLOS MAIS PEDIDOS
          </h2>
          
          <div className="px-6" style={{ overflow: 'visible' }}>
            <BolosMaisPedidosCarousel bolos={bolosMaisPedidos} />
          </div>
        </section>
      )}

      {/* Espaço consistente entre seções */}
      {bolosMaisPedidos.length > 0 && <div className="h-24"></div>}

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
          <div className="px-6">
            <FornadaCarousel produtos={produtosFornada} />
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