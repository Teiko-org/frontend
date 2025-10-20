import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { listResumoFornadaDoUsuario, aumentarQuantidadePedido, diminuirQuantidadePedido } from "../../service/cartFornadaService";
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

  useEffect(() => {
    carregarPedidos();
  }, []);

  const totals = useMemo(() => {
    const subtotalLocal = localItems.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
    const subtotalPedidos = pedidos.reduce((sum, it) => sum + Number(it.resumo?.valor || 0), 0);
    const subtotal = subtotalLocal + subtotalPedidos;
    return { subtotal, total: subtotal, shipping: 0, count: localItems.length + pedidos.length };
  }, [localItems, pedidos]);

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
              {localItems.map((item) => (
                <div key={`local-${item.type}-${item.id}`} className="flex items-start gap-3">
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
                      unitPrice={item.price}
                      quantity={item.quantity}
                      onDecrease={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                      onIncrease={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                      disableIncrease={Number.isFinite(item.maxQuantity) && item.quantity >= item.maxQuantity}
                      statusLabel="Local"
                      statusColor="bg-blue"
                      rightSuffix={`x${item.quantity}`}
                      totalText="Valor Total Estimado:"
                      disclaimer="Esse valor não inclui o valor do frete."
                      selected={!!selectedIds[`${item.type}-${item.id}`]}
                      onClick={() => setSelectedIds((prev) => ({ ...prev, [`${item.type}-${item.id}`]: !prev[`${item.type}-${item.id}`] }))}
                    />
                  </div>
                </div>
              ))}
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
              <div className="flex flex-wrap gap-2">
                {localItems.length > 0 && (
                  <Button
                    text={`Pagar selecionados (${Object.values(selectedIds).filter(Boolean).length})`}
                    fontSize="text-sm"
                    className="py-1 px-3"
                    onClick={() => {
                      const selecionados = localItems.filter((it) => selectedIds[`${it.type}-${it.id}`]);
                      if (selecionados.length === 0) {
                        toast.warn('Selecione ao menos um item.');
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
                )}
                <Button
                  text="Confirmar pagamento"
                  fontSize="text-sm"
                  className="py-1 px-3"
                  onClick={() => {
                    // Se houver itens marcados, usa apenas os selecionados; caso contrário, usa todos os itens do carrinho
                    const selecionadosMarcados = localItems.filter((it) => selectedIds[`${it.type}-${it.id}`]);
                    const itensParaPagar = selecionadosMarcados.length > 0 ? selecionadosMarcados : localItems;

                    if (itensParaPagar.length === 0) {
                      toast.warn('Adicione um item da Fornada antes de confirmar.');
                      navigate('/fornada');
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
                <Button
                  text="Limpar carrinho"
                  fontSize="text-sm"
                  className="py-1 px-3"
                  onClick={clearCart}
                  bgColor="bg-gray-200"
                  textColor="text-blue"
                />
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


