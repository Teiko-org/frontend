import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import BannerFornada from "../../components/BannerFornada";
import { getFornada, getProdutosPorFornadaId } from "../../service/fornadaService";
import { toast } from "react-toastify";

function FornadaSemana() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fornada, setFornada] = useState(null);
  
  // ID da fornada padrão (futuramente será dinâmico)
  // Para tornar dinâmico: pode vir de parâmetros da URL, contexto global, 
  // localStorage, ou uma seleção do usuário
  const FORNADA_ID_PADRAO = 1;

  useEffect(() => {
    const carregarProdutosFornada = async () => {
      try {
        setLoading(true);
        
        const fornadaAtual = await getFornada(FORNADA_ID_PADRAO);
        
        if (!fornadaAtual) {
          toast.error("Fornada não encontrada");
          setLoading(false);
          return;
        }
        
        setFornada(fornadaAtual);
        
        const produtosFornada = await getProdutosPorFornadaId(FORNADA_ID_PADRAO);
        
        setProdutos(produtosFornada);
        
      } catch (error) {
        console.error("Erro ao carregar produtos da fornada:", error);
        toast.error("Erro ao carregar os produtos da fornada");
      } finally {
        setLoading(false);
      }
    };

    carregarProdutosFornada();
  }, []);

  const isProdutoDisponivel = (produto) => {
    return produto.quantidade > 0 && produto.isAtivo;
  };

  if (loading) {
    return (
      <div className="bg-bgNativeHome min-h-screen">
        <Header />
        <BannerFornada />
        <section className="pt-8 pb-16 bg-bgHome border-t border-b border-gold">
          <h2 className="text-center text-4xl font-medium mb-6">
            FORNADA DA SEMANA
          </h2>
          <div className="text-center">
            <p className="text-blue text-lg">Carregando produtos...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-bgNativeHome">
      <Header />
      <BannerFornada fornada={fornada} />
      <section className="pt-8 pb-16 bg-bgHome border-t border-b border-gold">
        <h2 className="text-center text-4xl font-medium mb-6">
          FORNADA DA SEMANA
        </h2>
        
        {produtos.length === 0 ? (
          <div className="text-center">
            <p className="text-blue text-lg">Nenhum produto disponível na fornada ID {FORNADA_ID_PADRAO}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 px-24">
            {produtos.map((produto) => (
              <Card
                key={produto.fornadaDaVezId}
                type="Fornada"
                available={isProdutoDisponivel(produto)}
                produto={produto}
              />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

export default FornadaSemana;