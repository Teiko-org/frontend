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
import defaultImageCard from "../../assets/image_card.png";
import defaultImageFornada from "../../assets/image_fornada.png";

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
      // Timeout de 10 segundos para evitar loading infinito
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao carregar pedidos')), 10000)
      );
      const data = await Promise.race([
        listResumoFornadaDoUsuario(),
        timeoutPromise
      ]);
      setPedidos(data);
    } catch (e) {
      console.error("Erro ao carregar pedidos:", e);
      // Não mostra toast para não incomodar o usuário, apenas loga o erro
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const verificarStatusProdutos = async () => {
    const status = {};
    const itensFornada = localItems.filter(item => item.type === 'Fornada' && item.fornadaDaVezId);
    
    if (itensFornada.length === 0) {
      setProdutosStatus({});
      return;
    }

    // Coletar todas as fornadas únicas primeiro
    const fornadaIdsSet = new Set();
    const itensPorFornadaDaVezId = {};
    
    // Buscar produtos em paralelo com timeout
    const produtosPromises = itensFornada.map(item => 
      Promise.race([
        getProdutoFornadaById(item.fornadaDaVezId),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]).then(produto => ({ item, produto })).catch(error => {
        console.warn(`Erro ao buscar produto ${item.fornadaDaVezId}:`, error.message);
        return null;
      })
    );
    
    const produtosResults = await Promise.all(produtosPromises);
    
    // Agrupar por fornada
    const itensPorFornada = {};
    produtosResults.forEach(result => {
      if (result && result.produto && result.produto.fornada) {
        const fornadaId = result.produto.fornada;
        fornadaIdsSet.add(fornadaId);
        if (!itensPorFornada[fornadaId]) {
          itensPorFornada[fornadaId] = [];
        }
        itensPorFornada[fornadaId].push(result);
        itensPorFornadaDaVezId[result.item.fornadaDaVezId] = result.produto;
      }
    });
    
    // Buscar produtos de todas as fornadas em paralelo
    const produtosPorFornada = {};
    const fornadaPromises = Array.from(fornadaIdsSet).map(fornadaId =>
      Promise.race([
        axiosApi.get(`/fornadas/da-vez/produtos/${fornadaId}`, { timeout: 3000 }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]).then(resp => ({ fornadaId, data: resp.data })).catch(error => {
        console.warn(`Erro ao buscar produtos da fornada ${fornadaId}:`, error.message);
        return { fornadaId, data: [] };
      })
    );
    
    const fornadaResults = await Promise.all(fornadaPromises);
    fornadaResults.forEach(({ fornadaId, data }) => {
      produtosPorFornada[fornadaId] = {};
      if (Array.isArray(data)) {
        data.forEach(prod => {
          if (prod.fornadaDaVezId) {
            produtosPorFornada[fornadaId][prod.fornadaDaVezId] = prod.isAtivo === true;
          }
        });
      }
    });
    
    // Buscar fornadas em paralelo
    const fornadasMap = {};
    const fornadaInfoPromises = Array.from(fornadaIdsSet).map(fornadaId =>
      Promise.race([
        getFornada(fornadaId),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]).then(fornada => ({ fornadaId, fornada })).catch(error => {
        console.warn(`Erro ao buscar fornada ${fornadaId}:`, error.message);
        return null;
      })
    );
    
    const fornadaInfoResults = await Promise.all(fornadaInfoPromises);
    fornadaInfoResults.forEach(result => {
      if (result) {
        fornadasMap[result.fornadaId] = result.fornada;
      }
    });
    
    // Processar status de cada item
    for (const item of itensFornada) {
      const produto = itensPorFornadaDaVezId[item.fornadaDaVezId];
      
      if (!produto) {
        status[item.fornadaDaVezId] = {
          disponivel: false,
          quantidade: 0,
          isAtivo: false,
          fornadaEncerrada: false
        };
        continue;
      }
      
      let isAtivoProdutoFornada = true;
      if (produto.fornada && produtosPorFornada[produto.fornada]) {
        const isAtivoDaProjecao = produtosPorFornada[produto.fornada][item.fornadaDaVezId];
        if (isAtivoDaProjecao !== undefined) {
          isAtivoProdutoFornada = isAtivoDaProjecao;
        } else {
          isAtivoProdutoFornada = false;
        }
      } else {
        isAtivoProdutoFornada = produto.isAtivo !== false;
      }
      
      const quantidade = produto.quantidade || 0;
      
      let fornadaEncerrada = false;
      if (produto.fornada && fornadasMap[produto.fornada]) {
        const fornada = fornadasMap[produto.fornada];
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataFim = new Date(fornada.dataFim);
        dataFim.setHours(23, 59, 59, 999);
        fornadaEncerrada = dataFim < hoje;
      }
      
      const disponivel = quantidade > 0 && isAtivoProdutoFornada && !fornadaEncerrada;
      
      status[item.fornadaDaVezId] = {
        disponivel: disponivel,
        quantidade: quantidade,
        isAtivo: isAtivoProdutoFornada,
        fornadaEncerrada: fornadaEncerrada
      };
    }
    
    setProdutosStatus(status);
  };

  useEffect(() => {
    // Garantir que o loading seja definido como false após um tempo máximo
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 15000); // 15 segundos máximo
    
    carregarPedidos().finally(() => {
      clearTimeout(loadingTimeout);
    });
    
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  useEffect(() => {
    if (localItems.length > 0) {
      // Executa verificação de status de forma assíncrona sem bloquear a UI
      verificarStatusProdutos().catch(error => {
        console.error("Erro ao verificar status dos produtos:", error);
        // Define status padrão para todos os itens
        const defaultStatus = {};
        localItems.forEach(item => {
          if (item.type === 'Fornada' && item.fornadaDaVezId) {
            defaultStatus[item.fornadaDaVezId] = {
              disponivel: true, // Assume disponível por padrão
              quantidade: 0,
              isAtivo: true,
              fornadaEncerrada: false
            };
          }
        });
        setProdutosStatus(defaultStatus);
      });
    } else {
      // Se não há itens, limpa o status
      setProdutosStatus({});
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
        {loading && localItems.length === 0 && pedidos.length === 0 ? (
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
                      image={defaultImageFornada}
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
                    // "Confirmar todos" ignora checkboxes e pega todos os itens disponíveis
                    let itensParaPagar = localItems.filter(item => {
                      // Filtrar apenas itens de fornada disponíveis
                      if (item.type === 'Fornada' && item.fornadaDaVezId) {
                        const status = produtosStatus[item.fornadaDaVezId];
                        // Se o status foi verificado e não está disponível, remover
                        if (status !== undefined && !status.disponivel) {
                          return false;
                        }
                        // Se não tem fornadaDaVezId válido, remover
                        if (!item.fornadaDaVezId) {
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
                  <img src={it.image ?? defaultImageCard} className="w-16 h-16 rounded object-cover border border-gold" />
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


