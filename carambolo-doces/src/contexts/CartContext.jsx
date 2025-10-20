import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Função para obter a chave do carrinho baseada no usuário
  const getCartKey = () => {
    const userId = localStorage.getItem("userId");
    return userId ? `CART_ITEMS_USER_${userId}` : "CART_ITEMS_GUEST";
  };

  const [items, setItems] = useState(() => {
    try {
      const cartKey = getCartKey();
      const saved = localStorage.getItem(cartKey);
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const hasMountedRef = useRef(false);

  // Função para carregar carrinho do usuário atual
  const loadUserCart = () => {
    try {
      const cartKey = getCartKey();
      const saved = localStorage.getItem(cartKey);
      const cartItems = saved ? JSON.parse(saved) : [];
      setItems(cartItems);
      console.log(`Carrinho carregado para chave: ${cartKey}, itens:`, cartItems);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      setItems([]);
    }
  };

  // Carregar carrinho quando o usuário mudar
  useEffect(() => {
    const handleStorageChange = () => {
      loadUserCart();
    };

    // Escutar mudanças no localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Carregar carrinho inicial
    loadUserCart();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    try {
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(items));
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

  // Remove itens de fornada pelo fornadaDaVezId (útil após finalizar pedido)
  const removeByFornadaId = (fornadaDaVezId) => {
    if (!fornadaDaVezId) return;
    setItems((prev) => prev.filter((p) => !(p.type === 'Fornada' && p.fornadaDaVezId === fornadaDaVezId)));
  };

  const clearCart = () => setItems([]);

  // Função para limpar carrinho de convidado quando usuário faz login
  const clearGuestCart = () => {
    try {
      localStorage.removeItem("CART_ITEMS_GUEST");
    } catch (_) {
    }
  };

  // Função para migrar carrinho de convidado para usuário logado
  const migrateGuestCartToUser = () => {
    try {
      const guestCart = localStorage.getItem("CART_ITEMS_GUEST");
      if (guestCart) {
        const guestItems = JSON.parse(guestCart);
        if (guestItems.length > 0) {
          // Adicionar itens do carrinho de convidado ao carrinho do usuário
          guestItems.forEach(item => {
            addItem(item, item.quantity);
          });
          // Limpar carrinho de convidado
          clearGuestCart();
          console.log("Carrinho de convidado migrado para usuário logado");
        }
      }
    } catch (error) {
      console.error("Erro ao migrar carrinho de convidado:", error);
    }
  };

  // Função para migrar carrinho de usuário para convidado (logout)
  const migrateUserCartToGuest = () => {
    try {
      const currentCartKey = getCartKey();
      const currentItems = localStorage.getItem(currentCartKey);
      
      if (currentItems) {
        // Salvar carrinho atual como carrinho de convidado
        localStorage.setItem("CART_ITEMS_GUEST", currentItems);
        console.log("Carrinho do usuário migrado para convidado");
      }
    } catch (error) {
      console.error("Erro ao migrar carrinho para convidado:", error);
    }
  };

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
    () => ({ 
      items, 
      addItem, 
      removeItem, 
      removeByFornadaId,
      clearCart, 
      updateQuantity, 
      totals, 
      clearGuestCart, 
      migrateGuestCartToUser,
      migrateUserCartToGuest,
      loadUserCart 
    }),
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


