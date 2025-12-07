import React, { useEffect, useState, useMemo, useRef } from "react";
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
import { findFeaturedDecoracoes } from "../../service/productService";
import { getBolosComImagens } from "../../service/boloService";
import { getProdutosMaisPedidos } from "../../service/dashboardService";
import Carousel from "../../components/Carousel";
import './cardsTransition.css';

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
  const carambolosRef = useRef(null);
  const maisPedidosRef = useRef(null);

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
          setProdutosFornada(visiveis.slice(0, 4));
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
            const imagem = b.imagens?.[0] ?? "src/assets/image_card.png";
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
            imagens: ["src/assets/image_card.png"],
          }));
        try {
          const { axiosApi } = await import("../../provider/AxiosApi");
          const { data: todosDetalhes } = await axiosApi.get('/bolos/detalhe');
          const enriquecidos = await Promise.all(
            apenasBolos.map(async (p) => {
              try {
                const detalheBolo = todosDetalhes.find((d) => d.boloId === p.id);
                const categoria = detalheBolo?.categoria;
                const decoracaoId = detalheBolo?.decoracaoId;
                if (decoracaoId) {
                  const { data: decoracao } = await axiosApi.get(`/decoracoes/${decoracaoId}`);
                  const imagemUrl = decoracao?.imagens?.[0];
                  return { ...p, imagens: [imagemUrl || p.imagens?.[0]], categoria };
                }
                return { ...p, categoria };
              } catch {
                return null;
              }
            })
          );
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
            imagens: ["src/assets/image_card.png"],
          }));

        const { axiosApi } = await import("../../provider/AxiosApi");
        const { data: todosDetalhes } = await axiosApi.get('/bolos/detalhe');
        const enriquecidos = await Promise.all(
          apenasBolos.map(async (p) => {
            try {
              const detalheBolo = todosDetalhes.find((d) => d.boloId === p.id);
              const categoria = detalheBolo?.categoria;
              const decoracaoId = detalheBolo?.decoracaoId;
              if (decoracaoId) {
                const { data: decoracao } = await axiosApi.get(`/decoracoes/${decoracaoId}`);
                const imagemUrl = decoracao?.imagens?.[0];
                return { ...p, imagens: [imagemUrl || p.imagens?.[0]], categoria };
              }
              return { ...p, categoria };
            } catch {
              return null;
            }
          })
        );
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
      image: p.imagens?.[0] ?? "src/assets/image_card.png",
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
            {/* Setas fora do carrossel */}
            <div className="flex justify-between items-center px-4">
              <ArrowButton direction="left" onClick={() => carambolosRef.current?.prev()} />
              <div className="px-6 w-full">
                <Carousel 
                  ref={carambolosRef}
                  slides={slides} 
                  autoPlay 
                  interval={3500}
                  onSlideClick={handleTemaClick}
                  hideInternalArrows={true}
                />
              </div>
              <ArrowButton direction="right" onClick={() => carambolosRef.current?.next()} />
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
            <div className="flex justify-between items-center px-4">
              <ArrowButton direction="left" onClick={() => maisPedidosRef.current?.prev()} />
              <div className="px-6 w-full">
                <Carousel 
                  ref={maisPedidosRef}
                  slides={slidesMaisPedidos} 
                  autoPlay 
                  interval={3500}
                  onSlideClick={handleMaisPedidosClick}
                  hideInternalArrows={true}
                />
              </div>
              <ArrowButton direction="right" onClick={() => maisPedidosRef.current?.next()} />
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