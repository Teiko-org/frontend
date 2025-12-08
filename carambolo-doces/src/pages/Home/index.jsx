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
import { findFeaturedDecoracoes } from "../../service/productService";
import { getBolosComImagens } from "../../service/boloService";
import { getProdutosMaisPedidos } from "../../service/dashboardService";
import Carousel from "../../components/Carousel";
import defaultImageCard from "../../assets/image_card.png";
import './cardsTransition.css';

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
    // Calcular maxTranslate para garantir que o último item seja totalmente visível
    // O último item deve estar completamente dentro da viewport (100% da largura)
    const maxTranslate = Math.max(0, totalWidth - 100);
    
    // Calcular a posição desejada para centralizar o item atual
    let desired = current * cardWidthPercent + cardWidthPercent / 2 - 50;
    
    // Se estamos nos últimos itens, garantir que o último item seja totalmente visível
    const lastVisibleIndex = produtos.length - itemsPerView;
    if (current >= lastVisibleIndex) {
      // Quando chegamos nos últimos itens, posicionar para mostrar os últimos itemsPerView itens
      // Isso garante que o último card seja totalmente visível
      const lastItemsStart = (produtos.length - itemsPerView) * cardWidthPercent;
      // Centralizar o último conjunto de itens
      desired = lastItemsStart + (itemsPerView * cardWidthPercent) / 2 - 50;
    }
    
    // Garantir que não vá além do máximo permitido
    // Mas usar maxTranslate sem restrição adicional para permitir chegar até o final
    const clamped = Math.min(Math.max(desired, 0), maxTranslate);
    return clamped;
  }, [current, produtos.length, cardWidthPercent, itemsPerView]);

  return (
    <div className="relative w-full pb-8" style={{ overflow: 'hidden', overflowX: 'hidden', overflowY: 'hidden' }}>
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
        className="flex transition-transform ease-out duration-500 gap-x-[54px] px-6 md:px-12 py-4 fornada-carousel-container"
        style={{ transform: `translateX(-${translatePercent}%)`, overflow: 'visible' }}
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
  const [slidesCarambolos, setSlidesCarambolos] = useState([]);
  const [produtosFornada, setProdutosFornada] = useState([]);
  const [fornada, setFornada] = useState(null);
  const [fornadaParaBanner, setFornadaParaBanner] = useState(null);
  const [carambolosMaisPedidos, setCarambolosMaisPedidos] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q')?.trim().toLowerCase() || '';

  useEffect(() => {
    const fetchDecoracoes = async () => {
      try {
        const data = await findFeaturedDecoracoes();
        setDecoracoes(data || []);
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
          setFornada(fornadaAtual);
          const produtos = await getProdutosFornadaComImagens(fornadaAtual.id);
          const visiveis = (produtos || []).filter(p => (p.quantidade ?? 0) > 0 && (p.isAtivo ?? true));
          // Mostrar TODOS os produtos, não apenas 4
          setProdutosFornada(visiveis);
        } else {
          setFornada(null);
          setProdutosFornada([]);
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.warn("Erro ao carregar dados da fornada:", error.message);
        }
        setFornadaParaBanner(null);
        setFornada(null);
        setProdutosFornada([]);
      }
    };

    fetchDecoracoes();
    carregarDadosFornada();

    (async () => {
      try {
        const bolosAtivos = await getBolosComImagens();
        const porCategoria = new Map();
        (bolosAtivos || []).forEach((b) => {
          if (!b?.categoria) return;
          if (!porCategoria.has(b.categoria)) {
            const imagem = b.imagens?.[0] ?? defaultImageCard;
            porCategoria.set(b.categoria, { image: imagem, title: b.categoria, categoria: b.categoria, id: b.boloId ?? b.id });
          }
        });
        setSlidesCarambolos(Array.from(porCategoria.values()));
      } catch (e) {
        setSlidesCarambolos([]);
      }
    })();

    (async () => {
      try {
        const top = await getProdutosMaisPedidos();
        const apenasBolos = (top || [])
          .filter((p) => p.tipo === "BOLO")
          .filter((p) => (p.isAtivo ?? p.ativo ?? true) === true)
          .slice(0, 4)
          .map((p) => ({
            id: p.id,
            nome: p.nome,
            quantidade: p.quantidade,
            valorTotal: p.valorTotal,
            imagens: [defaultImageCard],
          }));
        try {
          const { axiosApi } = await import("../../provider/AxiosApi");
          const { data: todosDetalhes } = await axiosApi.get('/bolos/detalhe');
          
          // Coletar todos os IDs de decoração únicos
          const decoracaoIds = [...new Set(
            apenasBolos
              .map(p => {
                const detalhe = todosDetalhes.find((d) => d.boloId === p.id);
                return detalhe?.decoracaoId;
              })
              .filter(Boolean)
          )];
          
          // Buscar todas as decorações de uma vez em paralelo
          const decoracoesMap = new Map();
          if (decoracaoIds.length > 0) {
            const decoracoesPromises = decoracaoIds.map(id => 
              axiosApi.get(`/decoracoes/${id}`).then(r => [id, r.data]).catch(() => [id, null])
            );
            const decoracoesResults = await Promise.all(decoracoesPromises);
            decoracoesResults.forEach(([id, data]) => {
              if (data) decoracoesMap.set(id, data);
            });
          }
          
          // Enriquecer os bolos usando o mapa de decorações
          const enriquecidos = apenasBolos.map((p) => {
              try {
                const detalheBolo = todosDetalhes.find((d) => d.boloId === p.id);
                const categoria = detalheBolo?.categoria;
                const decoracaoId = detalheBolo?.decoracaoId;
              if (decoracaoId && decoracoesMap.has(decoracaoId)) {
                const decoracao = decoracoesMap.get(decoracaoId);
                  const imagemUrl = decoracao?.imagens?.[0];
                  return { ...p, imagens: [imagemUrl || p.imagens?.[0]], categoria };
                }
                return { ...p, categoria };
              } catch {
              return p;
              }
          });
          setCarambolosMaisPedidos(enriquecidos.filter(Boolean));
        } catch {
          setCarambolosMaisPedidos(apenasBolos);
        }
      } catch (err) {
        console.warn("Erro ao carregar produtos mais pedidos:", err?.message);
        setCarambolosMaisPedidos([]);
      }
    })();

    const onVisibilityChanged = async () => {
      try {
        const top = await getProdutosMaisPedidos();
        const apenasBolos = (top || [])
          .filter((p) => p.tipo === "BOLO")
          .filter((p) => (p.isAtivo ?? p.ativo ?? true) === true)
          .slice(0, 4)
          .map((p) => ({
            id: p.id,
            nome: p.nome,
            quantidade: p.quantidade,
            valorTotal: p.valorTotal,
            imagens: [defaultImageCard],
          }));

        const { axiosApi } = await import("../../provider/AxiosApi");
        const { data: todosDetalhes } = await axiosApi.get('/bolos/detalhe');
        
        // Coletar todos os IDs de decoração únicos
        const decoracaoIds = [...new Set(
          apenasBolos
            .map(p => {
              const detalhe = todosDetalhes.find((d) => d.boloId === p.id);
              return detalhe?.decoracaoId;
            })
            .filter(Boolean)
        )];
        
        // Buscar todas as decorações de uma vez em paralelo
        const decoracoesMap = new Map();
        if (decoracaoIds.length > 0) {
          const decoracoesPromises = decoracaoIds.map(id => 
            axiosApi.get(`/decoracoes/${id}`).then(r => [id, r.data]).catch(() => [id, null])
          );
          const decoracoesResults = await Promise.all(decoracoesPromises);
          decoracoesResults.forEach(([id, data]) => {
            if (data) decoracoesMap.set(id, data);
          });
        }
        
        // Enriquecer os bolos usando o mapa de decorações
        const enriquecidos = apenasBolos.map((p) => {
            try {
              const detalheBolo = todosDetalhes.find((d) => d.boloId === p.id);
              const categoria = detalheBolo?.categoria;
              const decoracaoId = detalheBolo?.decoracaoId;
            if (decoracaoId && decoracoesMap.has(decoracaoId)) {
              const decoracao = decoracoesMap.get(decoracaoId);
                const imagemUrl = decoracao?.imagens?.[0];
                return { ...p, imagens: [imagemUrl || p.imagens?.[0]], categoria };
              }
              return { ...p, categoria };
            } catch {
            return p;
            }
        });
        setCarambolosMaisPedidos(enriquecidos.filter(Boolean));
      } catch {}
    };
    window.addEventListener('carambolo:visibility-changed', onVisibilityChanged);
    return () => {
      window.removeEventListener('carambolo:visibility-changed', onVisibilityChanged);
    };
  }, []);

  const slides = useMemo(() => {
    const base = slidesCarambolos;
    if (!base || base.length === 0) return [];
    if (!searchQuery) return base;
    const q = searchQuery;
    if (q.includes('fornada')) return [];
    if (q.includes('carambolo') || q.includes('bolo')) return base;
    return base.filter(s => (s.title || '').toLowerCase().includes(q));
  }, [slidesCarambolos, searchQuery]);

  const slidesMaisPedidos = useMemo(() => {
    if (!carambolosMaisPedidos || carambolosMaisPedidos.length === 0) return [];
    const base = carambolosMaisPedidos.map((p) => ({
      image: p.imagens?.[0] ?? defaultImageCard,
      title: p.nome || "Carambolo",
      id: p.id,
      categoria: p.categoria,
    }));
    if (!searchQuery) return base;
    const q = searchQuery;
    if (q.includes('fornada')) return [];
    if (q.includes('carambolo') || q.includes('bolo')) return base;
    return base.filter(s => (s.title || '').toLowerCase().includes(q));
  }, [carambolosMaisPedidos, searchQuery]);

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

  const handleMaisPedidosClick = (slide) => {
    if (slide?.categoria) {
      navigate('/carambolos', { state: { categoriaSelecionada: slide.categoria } });
    } else {
      navigate('/carambolos');
    }
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

      {/* Carambolos Mais Pedidos - com carrossel */}
      {showCarambolos && (
      <section className="pt-8 pb-8 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          CARAMBOLOS MAIS PEDIDOS
        </h2>
        
        {slidesMaisPedidos.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg mx-auto mb-4 w-64"></div>
              <p className="text-xl text-gray-600 mb-4">
                {searchQuery ? 'Nenhum resultado para sua busca.' : 'Carregando carambolos...'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6">
              <Carousel 
                slides={slidesMaisPedidos} 
                autoPlay 
                interval={3500}
                onSlideClick={handleMaisPedidosClick}
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
                onClick={() => navigate('/carambolos')}
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