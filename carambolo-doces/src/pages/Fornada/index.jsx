import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import BannerFornada from "../../components/BannerFornada";
import { getFornadaAtiva, getProdutosFornadaComImagens } from "../../service/fornadaService";
import { toast } from "react-toastify";

function FornadaSemana() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fornada, setFornada] = useState(null);

  useEffect(() => {
    const carregarProdutosFornada = async () => {
      try {
        setLoading(true);
        
        // Buscar qualquer fornada (ativa, futura ou próxima) para o banner
        const fornadaAtual = await getFornadaAtiva();
        
        if (!fornadaAtual) {
          setFornada(null);
          setProdutos([]);
          setLoading(false);
          return;
        }
        
        setFornada(fornadaAtual);
        
        // Buscar produtos apenas se a fornada estiver realmente ativa
        const hoje = new Date();
        const [yi, mi, di] = String(fornadaAtual.dataInicio).split("-").map(Number);
        const [yf, mf, df] = String(fornadaAtual.dataFim).split("-").map(Number);
        const dataInicio = new Date(yi, mi - 1, di, 0, 0, 0, 0);
        const dataFim = new Date(yf, mf - 1, df, 23, 59, 59, 999);
        const isFornadaAtiva = hoje >= dataInicio && hoje <= dataFim;
        
        if (isFornadaAtiva) {
          const produtosFornada = await getProdutosFornadaComImagens(fornadaAtual.id);
          setProdutos(produtosFornada);
        } else {
          setProdutos([]);
        }
        
      } catch (error) {
        console.error("Erro ao carregar produtos da fornada:", error);
        // Não mostrar toast de erro para usuários não logados
        if (error.response?.status !== 401) {
          toast.error("Erro ao carregar os produtos da fornada");
        }
        setFornada(null);
        setProdutos([]);
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
      <div className="bg-bgNativeHome min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <BannerFornada />
          <section className="pt-8 pb-16 bg-bgHome border-t border-b border-gold">
            <h2 className="text-center text-4xl font-medium mb-6">
              FORNADA DA SEMANA
            </h2>
            <div className="text-center">
              <p className="text-blue text-lg">Carregando produtos...</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-bgNativeHome min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BannerFornada fornada={fornada} />
        <section className="pt-8 pb-16 bg-bgHome border-t border-b border-gold">
          <h2 className="text-center text-4xl font-medium mb-6">
            FORNADA DA SEMANA
          </h2>
          
          {produtos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 mb-2">
                Não há uma fornada rolando no momento
              </p>
              <p className="text-sm text-gray-500">
                Fique atento às nossas redes sociais para saber quando será a próxima!
              </p>
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
      </main>
      <Footer />
    </div>
  );
}

export default FornadaSemana;