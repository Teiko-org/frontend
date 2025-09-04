import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("CART_ITEMS");
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    try {
      localStorage.setItem("CART_ITEMS", JSON.stringify(items));
    } catch (_) {
    }
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((p) => p.id === product.id && p.type === product.type);
      if (index !== -1) {
        const updated = [...prev];
        const max = product.maxQuantity ?? updated[index].maxQuantity ?? Infinity;
        const nextQty = Math.min(max, updated[index].quantity + quantity);
        updated[index] = { ...updated[index], quantity: nextQty, maxQuantity: max };
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name ?? product.produto ?? product.categoria ?? "Produto",
          price: product.price ?? product.valor ?? 0,
          image:
            product.image ??
            (product.imagens && product.imagens[0]
              ? (typeof product.imagens[0] === "object" ? product.imagens[0].url : product.imagens[0])
              : undefined),
          type: product.type ?? "Produto",
          fornadaDaVezId: product.fornadaDaVezId ?? product.fornadaDaVezId,
          quantity: Math.max(1, Math.min(product.maxQuantity ?? Infinity, quantity)),
          maxQuantity: product.maxQuantity ?? Infinity,
        },
      ];
    });
  };

  const removeItem = (id, type = "Produto") => {
    setItems((prev) => prev.filter((p) => !(p.id === id && p.type === type)));
  };

  const clearCart = () => setItems([]);

  const updateQuantity = (id, type, quantity) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id && p.type === type ? { ...p, quantity: Math.max(1, Math.min(p.maxQuantity ?? Infinity, quantity)) } : p))
    );
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
    return {
      subtotal,
      shipping: 0,
      total: subtotal,
      count: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    };
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, clearCart, updateQuantity, totals }),
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return ctx;
}


