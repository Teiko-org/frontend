import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { listResumoFornadaDoUsuario, aumentarQuantidadePedido, diminuirQuantidadePedido } from "../../service/cartFornadaService";
import { getProdutoFornadaById, getFornada } from "../../service/fornadaService";
import { axiosApi } from "../../provider/AxiosApi";
import { toast } from "react-toastify";
import CartItemCard from "../../components/CartItemCard";
import ModalBaseForm from "../../components/ModalBaseForm";

export default function CartPage() {
  const { items: localItems, clearCart, updateQuantity, removeItem } = useCart();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState({});
  const [isMultiModalOpen, setMultiModalOpen] = useState(false);
  const [produtosStatus, setProdutosStatus] = useState({});

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const data = await listResumoFornadaDoUsuario();
      setPedidos(data);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao carregar carrinho");
    } finally {
      setLoading(false);
    }
  };

  const verificarStatusProdutos = async () => {
    const status = {};
    const itensPorFornada = {};
    for (const item of localItems) {
      if (item.type === 'Fornada' && item.fornadaDaVezId) {
        try {
          const produto = await getProdutoFornadaById(item.fornadaDaVezId);
          if (produto.fornada) {
            if (!itensPorFornada[produto.fornada]) {
              itensPorFornada[produto.fornada] = [];
            }
            itensPorFornada[produto.fornada].push({ item, produto });
          }
        } catch (error) {
          console.error(`Erro ao buscar FornadaDaVez ${item.fornadaDaVezId}:`, error);
        }
      }
    }
    
    const produtosPorFornada = {};
    for (const [fornadaId, itens] of Object.entries(itensPorFornada)) {
      try {
        const produtosProjecao = await axiosApi.get(`/fornadas/da-vez/produtos/${fornadaId}`);
        produtosPorFornada[fornadaId] = {};
        if (Array.isArray(produtosProjecao.data)) {
          produtosProjecao.data.forEach(prod => {
            if (prod.fornadaDaVezId) {
              produtosPorFornada[fornadaId][prod.fornadaDaVezId] = prod.isAtivo === true;
            }
          });
        }
      } catch (error) {
        console.warn(`Erro ao buscar produtos da fornada ${fornadaId}:`, error.response?.status || error.message);
        produtosPorFornada[fornadaId] = {};
      }
    }
    
    for (const item of localItems) {
      if (item.type === 'Fornada' && item.fornadaDaVezId) {
        try {
          const produto = await getProdutoFornadaById(item.fornadaDaVezId);
          
          let isAtivoProdutoFornada = true;
          if (produto.fornada && produtosPorFornada[produto.fornada]) {
            const isAtivoDaProjecao = produtosPorFornada[produto.fornada][item.fornadaDaVezId];
            if (isAtivoDaProjecao !== undefined) {
              isAtivoProdutoFornada = isAtivoDaProjecao;
            } else {
              isAtivoProdutoFornada = false;
            }
          } else {
            if (produto.produtoFornada) {
              try {
                const produtoFornadaResponse = await axiosApi.get(`/fornadas/produto-fornada/${produto.produtoFornada}`);
                isAtivoProdutoFornada = produtoFornadaResponse.data.isAtivo === true;
              } catch (error) {
                console.warn(`Erro ao buscar ProdutoFornada ${produto.produtoFornada}:`, error.response?.status || error.message);
                isAtivoProdutoFornada = produto.isAtivo !== false;
              }
            } else {
              isAtivoProdutoFornada = produto.isAtivo !== false;
            }
          }
          
          const isAtivo = isAtivoProdutoFornada;
          const quantidade = produto.quantidade || 0;
          
          let fornadaEncerrada = false;
          if (produto.fornada) {
            try {
              const fornada = await getFornada(produto.fornada);
              const hoje = new Date();
              hoje.setHours(0, 0, 0, 0);
              const dataFim = new Date(fornada.dataFim);
              dataFim.setHours(23, 59, 59, 999);
              
              if (dataFim < hoje) {
                fornadaEncerrada = true;
              }
            } catch (error) {
              console.error(`Erro ao buscar fornada ${produto.fornada}:`, error);
            }
          }
          
          const disponivel = quantidade > 0 && isAtivo && !fornadaEncerrada;
          
          status[item.fornadaDaVezId] = {
            disponivel: disponivel,
            quantidade: quantidade,
            isAtivo: isAtivo,
            fornadaEncerrada: fornadaEncerrada
          };
        } catch (error) {
          console.error(`Erro ao verificar produto ${item.fornadaDaVezId}:`, error);
          status[item.fornadaDaVezId] = {
            disponivel: false,
            quantidade: 0,
            isAtivo: null,
            fornadaEncerrada: null
          };
        }
      }
    }
    setProdutosStatus(status);
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  useEffect(() => {
    if (localItems.length > 0) {
      verificarStatusProdutos();
    }
  }, [localItems.length]);

  const totals = useMemo(() => {
    const itensDisponiveis = localItems.filter(item => {
      if (item.type === 'Fornada' && item.fornadaDaVezId) {
        const status = produtosStatus[item.fornadaDaVezId];
        if (status !== undefined && !status.disponivel) {
          return false;
        }
      }
      return true;
    });
    
    const subtotalLocal = itensDisponiveis.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
    const subtotalPedidos = pedidos.reduce((sum, it) => sum + Number(it.resumo?.valor || 0), 0);
    const subtotal = subtotalLocal + subtotalPedidos;
    return { subtotal, total: subtotal, shipping: 0, count: itensDisponiveis.length + pedidos.length };
  }, [localItems, pedidos, produtosStatus]);

  return (
    <div className="bg-bgNativeHome min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto py-10 px-4">
        <h1 className="text-3xl font-semibold text-blue mb-6">Seu carrinho</h1>
        {loading ? (
          <div className="bg-white border-2 border-gold rounded-lg p-8 text-center">
            <p className="text-blue text-lg">Carregando...</p>
          </div>
        ) : (localItems.length + pedidos.length) === 0 ? (
          <div className="bg-white border-2 border-gold rounded-lg p-8 text-center">
            <p className="text-blue text-lg">Seu carrinho está vazio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-4">
              {localItems.map((item) => {
                const status = produtosStatus[item.fornadaDaVezId];
                const statusVerificado = status !== undefined;
                const isIndisponivel = statusVerificado && !status.disponivel;
                
                let motivoOverlay = 'INDISPONÍVEL';
                let textoDisponibilidade = 'Disponível';
                
                if (statusVerificado && isIndisponivel) {
                  textoDisponibilidade = 'Indisponível';
                  motivoOverlay = 'INDISPONÍVEL';
                } else if (statusVerificado && !isIndisponivel) {
                  textoDisponibilidade = 'Disponível';
                }
                
                return (
                  <div key={`local-${item.type}-${item.id}`} className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="pt-2">
                        <input
                          type="checkbox"
                          checked={!!selectedIds[`${item.type}-${item.id}`]}
                          onChange={(e) => setSelectedIds((prev) => ({ ...prev, [`${item.type}-${item.id}`]: e.target.checked }))}
                          className="w-5 h-5 accent-gold cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <CartItemCard
                          image={item.image}
                          title={item.name}
                          subtitle={item.type}
                          availableText={textoDisponibilidade}
                          unitPrice={item.price}
                          quantity={item.quantity}
                          onDecrease={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                          onIncrease={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                          disableIncrease={isIndisponivel || (Number.isFinite(item.maxQuantity) && item.quantity >= item.maxQuantity)}
                          disableDecrease={isIndisponivel}
                          statusLabel="Local"
                          statusColor="bg-blue"
                          rightSuffix={`x${item.quantity}`}
                          totalText="Valor Total Estimado:"
                          disclaimer="Esse valor não inclui o valor do frete."
                          selected={!!selectedIds[`${item.type}-${item.id}`]}
                          onClick={() => setSelectedIds((prev) => ({ ...prev, [`${item.type}-${item.id}`]: !prev[`${item.type}-${item.id}`] }))}
                          isUnavailable={isIndisponivel}
                          unavailableReason={motivoOverlay}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              {pedidos.map(({ resumo, pedido }) => (
                <div key={`pf-${resumo.pedidoFornadaId}`} className="flex items-start gap-3">
                  <div className="pt-2">
                    <input type="checkbox" className="w-5 h-5 accent-gold cursor-pointer" disabled />
                  </div>
                  <div className="flex-1">
                    <CartItemCard
                      image={"src/assets/image_fornada.png"}
                      title={`Pedido #${resumo.id}`}
                      subtitle={`Status: ${resumo.status}`}
                      unitPrice={Number(resumo.valor || 0) / Math.max(1, Number(pedido.quantidade || 1))}
                      quantity={pedido.quantidade}
                      onDecrease={async () => { await diminuirQuantidadePedido(resumo.pedidoFornadaId); carregarPedidos(); }}
                      onIncrease={async () => { const r = await aumentarQuantidadePedido(resumo.pedidoFornadaId); if (!r.ok) toast.warn("Quantidade indisponível no estoque"); carregarPedidos(); }}
                      disableIncrease={["PAGO","CONCLUIDO","CANCELADO"].includes(resumo.status)}
                      statusLabel={resumo.status}
                      statusColor={resumo.status === 'PAGO' ? 'bg-green-600' : resumo.status === 'CONCLUIDO' ? 'bg-blue' : resumo.status === 'CANCELADO' ? 'bg-red-600' : 'bg-yellow-500'}
                      rightSuffix={`x${pedido.quantidade}`}
                      totalText="Valor Total Estimado:"
                      disclaimer="Esse valor não inclui o valor do frete."
                    />
                  </div>
                </div>
              ))}
            </section>

            <aside className="bg-white border-2 border-gold rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold text-blue mb-4">Resumo</h2>
              <div className="flex justify-between text-blue mb-2">
                <span>Subtotal</span>
                <span>R$ {totals.subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-blue mb-4">
                <span>Frete</span>
                <span>R$ {totals.shipping.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-blue font-semibold text-lg border-t border-gold pt-3 mb-6">
                <span>Total</span>
                <span>R$ {totals.total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  text="Confirmar todos"
                  fontSize="text-xs"
                  className="py-1 px-2.5"
                  onClick={() => {
                    const selecionadosMarcados = localItems.filter((it) => selectedIds[`${it.type}-${it.id}`]);
                    let itensParaPagar = selecionadosMarcados.length > 0 ? selecionadosMarcados : localItems;

                    itensParaPagar = itensParaPagar.filter(item => {
                      if (item.type === 'Fornada' && item.fornadaDaVezId) {
                        const status = produtosStatus[item.fornadaDaVezId];
                        if (status !== undefined && !status.disponivel) {
                          return false;
                        }
                      }
                      return true;
                    });

                    if (itensParaPagar.length === 0) {
                      toast.warn('Não há itens disponíveis para confirmar.');
                      return;
                    }

                    if (itensParaPagar.length === 1) {
                      const item = itensParaPagar[0];
                      navigate('/pedido-fornada', { state: { produto: {
                        produto: item.name,
                        valor: item.price,
                        imagens: item.image ? [item.image] : [],
                        fornadaDaVezId: item.fornadaDaVezId,
                        quantidade: item.maxQuantity === Infinity ? 9999 : item.maxQuantity
                      }, quantidade: item.quantity } });
                    } else {
                      navigate('/pedido-fornada-multiplo', { state: { itens: itensParaPagar, redirectToForm: true } });
                    }
                  }}
                />
                {localItems.length > 0 ? (
                  <Button
                    text={`Confirmar selecionados (${Object.values(selectedIds).filter(Boolean).length})`}
                    fontSize="text-xs"
                    className="py-1 px-2.5"
                    onClick={() => {
                      const selecionados = localItems.filter((it) => selectedIds[`${it.type}-${it.id}`]);
                      if (selecionados.length === 0) {
                        toast.warn('Selecione ao menos um item.');
                        return;
                      }
                      
                      const produtosIndisponiveis = selecionados.filter(item => {
                        const status = produtosStatus[item.fornadaDaVezId];
                        return status && !status.disponivel;
                      });
                      
                      if (produtosIndisponiveis.length > 0) {
                        toast.error('Há produtos esgotados, ocultados ou de fornada encerrada selecionados. Remova-os antes de continuar.');
                        return;
                      }
                      
                      if (selecionados.length === 1) {
                        const item = selecionados[0];
                        navigate('/pedido-fornada', { state: { produto: {
                          produto: item.name,
                          valor: item.price,
                          imagens: item.image ? [item.image] : [],
                          fornadaDaVezId: item.fornadaDaVezId,
                          quantidade: item.maxQuantity === Infinity ? 9999 : item.maxQuantity
                        }, quantidade: item.quantity } });
                      } else {
                        navigate('/pedido-fornada-multiplo', { state: { itens: selecionados, redirectToForm: true } });
                      }
                    }}
                  />
                ) : (
                  <div></div>
                )}
                <Button
                  text="Limpar carrinho"
                  fontSize="text-xs"
                  className="py-1 px-2.5"
                  onClick={clearCart}
                  bgColor="bg-gray-200"
                  textColor="text-blue"
                />
                {localItems.length > 0 ? (
                  <Button
                    text={`Limpar selecionados (${Object.values(selectedIds).filter(Boolean).length})`}
                    fontSize="text-xs"
                    className="py-1 px-2.5"
                    onClick={() => {
                      const selecionados = localItems.filter((it) => selectedIds[`${it.type}-${it.id}`]);
                      if (selecionados.length === 0) {
                        toast.warn('Nenhum item selecionado.');
                        return;
                      }
                      
                      selecionados.forEach(item => {
                        removeItem(item.id, item.type);
                      });
                      
                      setSelectedIds({});
                      toast.success(`${selecionados.length} item(ns) removido(s) do carrinho.`);
                    }}
                    bgColor="bg-gray-200"
                    textColor="text-blue"
                  />
                ) : (
                  <div></div>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      {isMultiModalOpen && (
        <ModalBaseForm
          isOpen={isMultiModalOpen}
          onClose={() => setMultiModalOpen(false)}
          title="Finalizar múltiplos itens da Fornada"
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {localItems.filter((it) => selectedIds[`${it.type}-${it.id}`]).map((it) => (
                <div key={`modal-${it.type}-${it.id}`} className="flex items-center gap-3 bg-white border-2 border-gold rounded-xl p-3">
                  <img src={it.image ?? 'src/assets/image_card.png'} className="w-16 h-16 rounded object-cover border border-gold" />
                  <div className="flex-1">
                    <div className="text-black font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>{it.name}</div>
                    <div className="text-black/70 text-sm">Qtd: {it.quantity} • R$ {Number(it.price).toFixed(2).replace('.', ',')}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                text="Continuar"
                fontSize="text-sm"
                className="py-1 px-3"
                onClick={() => {
                  const selecionados = localItems.filter((it) => selectedIds[`${it.type}-${it.id}`]);
                  setMultiModalOpen(false);
                  navigate('/pedido-fornada-multiplo', { state: { itens: selecionados } });
                }}
              />
              <Button
                text="Cancelar"
                fontSize="text-sm"
                className="py-1 px-3"
                bgColor="bg-gray-200"
                textColor="text-blue"
                onClick={() => setMultiModalOpen(false)}
              />
            </div>
          </div>
        </ModalBaseForm>
      )}

      <Footer />
    </div>
  );
}


