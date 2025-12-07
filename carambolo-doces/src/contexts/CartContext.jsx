import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { buscarCarrinhoBackend, salvarCarrinhoBackend, limparCarrinhoBackend } from "../service/cartService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const getCartKey = () => {
    const userId = localStorage.getItem("userId");
    return userId ? `CART_ITEMS_USER_${userId}` : "CART_ITEMS_GUEST";
  };

  const isUserLoggedIn = () => {
    const userId = localStorage.getItem("userId");
    const isSigned = localStorage.getItem("IS_SIGNED");
    return userId && isSigned === "true";
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
  const syncTimeoutRef = useRef(null);
  const isSyncingRef = useRef(false);
  const lastUserIdRef = useRef(null);

  const loadUserCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      
      if (userId && isUserLoggedIn()) {
        try {
          // Timeout de 5 segundos para evitar travamento
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout ao buscar carrinho')), 5000)
          );
          
          const backendItems = await Promise.race([
            buscarCarrinhoBackend(parseInt(userId)),
            timeoutPromise
          ]);
          
          setItems(backendItems);
          const cartKey = getCartKey();
          localStorage.setItem(cartKey, JSON.stringify(backendItems));
        } catch (error) {
          console.warn("Erro ao buscar carrinho do backend, usando localStorage:", error.message || error);
          const cartKey = getCartKey();
          const saved = localStorage.getItem(cartKey);
          const cartItems = saved ? JSON.parse(saved) : [];
          setItems(cartItems);
        }
      } else {
        const cartKey = getCartKey();
        const saved = localStorage.getItem(cartKey);
        const cartItems = saved ? JSON.parse(saved) : [];
        setItems(cartItems);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      try {
        const cartKey = getCartKey();
        const saved = localStorage.getItem(cartKey);
        const cartItems = saved ? JSON.parse(saved) : [];
        setItems(cartItems);
      } catch (_) {
        setItems([]);
      }
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      loadUserCart().catch(console.error);
    };

    window.addEventListener('storage', handleStorageChange);
    
    loadUserCart().catch(console.error);

    const checkUserId = () => {
      const currentUserId = localStorage.getItem("userId");
      const lastUserId = lastUserIdRef.current;
      
      if (currentUserId !== lastUserId) {
        lastUserIdRef.current = currentUserId;
        loadUserCart().catch(console.error);
      }
    };

    lastUserIdRef.current = localStorage.getItem("userId");

    const intervalId = setInterval(checkUserId, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    
    const userId = localStorage.getItem("userId");
    if (!userId || !isUserLoggedIn()) {
      try {
        const cartKey = getCartKey();
        localStorage.setItem(cartKey, JSON.stringify(items));
      } catch (_) {}
      return;
    }

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        isSyncingRef.current = true;
        await salvarCarrinhoBackend(parseInt(userId), items);
        const cartKey = getCartKey();
        localStorage.setItem(cartKey, JSON.stringify(items));
      } catch (error) {
        console.error("Erro ao sincronizar carrinho com backend:", error);
        try {
          const cartKey = getCartKey();
          localStorage.setItem(cartKey, JSON.stringify(items));
        } catch (_) {}
      } finally {
        isSyncingRef.current = false;
      }
    }, 500);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
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

  const removeByFornadaId = (fornadaDaVezId) => {
    if (!fornadaDaVezId) return;
    setItems((prev) => prev.filter((p) => !(p.type === 'Fornada' && p.fornadaDaVezId === fornadaDaVezId)));
  };

  const clearCart = async () => {
    setItems([]);
    const userId = localStorage.getItem("userId");
    if (userId && isUserLoggedIn()) {
      try {
        await limparCarrinhoBackend(parseInt(userId));
      } catch (error) {
        console.error("Erro ao limpar carrinho no backend:", error);
      }
    }
    try {
      const cartKey = getCartKey();
      localStorage.removeItem(cartKey);
    } catch (_) {}
  };

  const clearGuestCart = () => {
    try {
      localStorage.removeItem("CART_ITEMS_GUEST");
    } catch (_) {
    }
  };

  const migrateGuestCartToUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId || !isUserLoggedIn()) {
        return;
      }

      const guestCart = localStorage.getItem("CART_ITEMS_GUEST");
      const guestItems = guestCart ? JSON.parse(guestCart) : [];
      
      if (guestItems.length === 0) {
        try {
          const backendItems = await buscarCarrinhoBackend(parseInt(userId));
          setItems(backendItems);
          const userCartKey = `CART_ITEMS_USER_${userId}`;
          localStorage.setItem(userCartKey, JSON.stringify(backendItems));
        } catch (error) {
          console.warn("Erro ao buscar carrinho do backend:", error);
          const userCartKey = `CART_ITEMS_USER_${userId}`;
          const userCart = localStorage.getItem(userCartKey);
          const userItems = userCart ? JSON.parse(userCart) : [];
          setItems(userItems);
        }
        return;
      }
      
      let backendItems = [];
      try {
        backendItems = await buscarCarrinhoBackend(parseInt(userId));
      } catch (error) {
        console.warn("Erro ao buscar carrinho do backend, usando localStorage:", error);
        const userCartKey = `CART_ITEMS_USER_${userId}`;
        const userCart = localStorage.getItem(userCartKey);
        backendItems = userCart ? JSON.parse(userCart) : [];
      }
      
      const combinedItems = [...guestItems];
      backendItems.forEach(backendItem => {
        const existingIndex = combinedItems.findIndex(
          item => item.id === backendItem.id && item.type === backendItem.type
        );
        if (existingIndex !== -1) {
          const existingItem = combinedItems[existingIndex];
          const max = Math.max(existingItem.maxQuantity ?? Infinity, backendItem.maxQuantity ?? Infinity);
          combinedItems[existingIndex] = {
            ...existingItem,
            quantity: Math.min(max, existingItem.quantity + backendItem.quantity),
            maxQuantity: max
          };
        } else {
          combinedItems.push(backendItem);
        }
      });
      
      setItems(combinedItems);
      
      const userCartKey = `CART_ITEMS_USER_${userId}`;
      localStorage.setItem(userCartKey, JSON.stringify(combinedItems));
      
      try {
        await salvarCarrinhoBackend(parseInt(userId), combinedItems);
      } catch (error) {
        console.error("Erro ao salvar carrinho no backend (itens preservados no localStorage):", error);
      }
      
      clearGuestCart();
    } catch (error) {
      console.error("Erro ao migrar carrinho de convidado:", error);
      try {
        const userId = localStorage.getItem("userId");
        const guestCart = localStorage.getItem("CART_ITEMS_GUEST");
        if (userId && guestCart) {
          const guestItems = JSON.parse(guestCart);
          const userCartKey = `CART_ITEMS_USER_${userId}`;
          localStorage.setItem(userCartKey, JSON.stringify(guestItems));
          setItems(guestItems);
        }
      } catch (preserveError) {
        console.error("Erro ao preservar itens do guest:", preserveError);
      }
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
