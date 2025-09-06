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
import { findFeaturedDecoracoes } from "../../service/productService";
import { getProdutosMaisPedidos } from "../../service/dashboardService";
import Carousel from "../../components/Carousel";
import './cardsTransition.css';

function Home() {
  const [decoracoes, setDecoracoes] = useState([]);
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
        if (error.response?.status === 401) {
          console.log("ℹ️ Carregando decorações sem autenticação...");
        } else {
          console.warn("⚠️ Erro ao carregar decorações:", error.message);
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
          setProdutosFornada(produtos.slice(0, 4));
        } else {
          setFornada(null);
          setProdutosFornada([]);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("ℹ️ Carregando dados da fornada sem autenticação...");
        } else {
          console.warn("⚠️ Erro ao carregar dados da fornada:", error.message);
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
        const top = await getProdutosMaisPedidos();
        const apenasBolos = (top || [])
          .filter((p) => p.tipo === "BOLO")
          .slice(0, 4)
          .map((p) => ({
            id: p.id,
            nome: p.nome,
            quantidade: p.quantidade,
            valorTotal: p.valorTotal,
            // placeholder de imagem; ao clicar, navegaremos para a página de pedido de bolo
            imagens: ["src/assets/image_card.png"],
          }));
        try {
          const { axiosApi } = await import("../../provider/AxiosApi");
          const enriquecidos = await Promise.all(
            apenasBolos.map(async (p) => {
              try {
                const { data: bolo } = await axiosApi.get(`/bolos/${p.id}`);
                const decoracaoId = bolo?.decoracaoId;
                if (decoracaoId) {
                  const { data: decoracao } = await axiosApi.get(`/decoracoes/${decoracaoId}`);
                  const imagemUrl = decoracao?.imagens?.[0];
                  const nomeDecoracao = decoracao?.categoria || decoracao?.nome || p.nome;
                  return { ...p, imagens: [imagemUrl || p.imagens?.[0]], nome: nomeDecoracao };
                }
                return p;
              } catch {
                return p;
              }
            })
          );
          setCarambolosMaisPedidos(enriquecidos);
        } catch {
          setCarambolosMaisPedidos(apenasBolos);
        }
      } catch (err) {
        console.warn("⚠️ Erro ao carregar produtos mais pedidos:", err?.message);
        setCarambolosMaisPedidos([]);
      }
    })();
  }, []);

  // (removido sticky footer hack da Home)

  const slides = useMemo(() => {
    if (!decoracoes || decoracoes.length === 0) {
      return [];
    }
    const base = decoracoes.map((d) => ({ 
      image: d.imagens?.[0]?.url ?? d.imagens?.[0] ?? "src/assets/image_card.png", 
      title: d.categoria ?? d.nome,
      categoria: d.categoria,
      id: d.id
    }));
    if (!searchQuery) return base;
    const q = searchQuery;
    if (q.includes('fornada')) return [];
    if (q.includes('carambolo') || q.includes('bolo')) return base;
    return base.filter(s => (s.title || '').toLowerCase().includes(q));
  }, [decoracoes, searchQuery]);

  const handleTemaClick = (slide) => {
    if (slide.categoria) {
      navigate('/carambolos', { state: { categoriaSelecionada: slide.categoria } });
    }
  };

  const handleVerMaisTemas = () => {
    navigate('/carambolos');
  };

  const slidesMaisPedidos = useMemo(() => {
    if (!carambolosMaisPedidos || carambolosMaisPedidos.length === 0) return [];
    const base = carambolosMaisPedidos.map((p) => ({
      image: p.imagens?.[0] ?? "src/assets/image_card.png",
      title: p.nome || "Carambolo",
      id: p.id,
    }));
    if (!searchQuery) return base;
    const q = searchQuery;
    if (q.includes('fornada')) return [];
    if (q.includes('carambolo') || q.includes('bolo')) return base;
    return base.filter(s => (s.title || '').toLowerCase().includes(q));
  }, [carambolosMaisPedidos, searchQuery]);

  const showCarambolos = !searchQuery || searchQuery.includes('carambolo') || searchQuery.includes('bolo');
  const showFornada = !searchQuery || searchQuery.includes('fornada');

  const handleMaisPedidosClick = () => {
    navigate('/carambolos');
  };

  return (
    <div className="bg-bgNativeHome min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">        
      <BannerPrincipal />
      <div className="h-12"></div>
      
      {/* Banner de Fornada - aparece se houver fornada (ativa ou futura) */}
      {fornadaParaBanner && (
        <>
          <BannerFornada fornada={fornadaParaBanner} />
          <div className="h-12"></div>
        </>
      )}
      
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

      {/* Carambolos Mais Pedidos - mesmo layout do carrossel acima */}
      {showCarambolos && (
      <section className="pt-8 pb-8 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          CARAMBOLOS MAIS PEDIDOS
        </h2>

        {slidesMaisPedidos.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg mx-auto mb-4 w-64"></div>
              <p className="text-xl text-gray-600 mb-4">{searchQuery ? 'Nenhum resultado para sua busca.' : 'Carregando carambolos...'}</p>
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
                onClick={handleMaisPedidosClick}
              />
            </div>
          </>
        )}
      </section>
      )}

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