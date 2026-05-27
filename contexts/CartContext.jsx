'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'oc_cart';

const CartContext = createContext(null);

function mergeItems(existing, incoming) {
  const map = new Map(existing.map((i) => [`${i.productId}-${i.size}`, i]));
  incoming.forEach((i) => {
    const key = `${i.productId}-${i.size}`;
    if (map.has(key)) {
      map.get(key).qty += i.qty;
    } else {
      map.set(key, { ...i });
    }
  });
  return Array.from(map.values());
}

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setItems(stored);
    } catch { /* ignore */ }
  }, []);

  // Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Sync with server cart when user logs in
  useEffect(() => {
    if (!session?.user) return;
    (async () => {
      try {
        const res  = await fetch('/api/user/cart');
        const data = await res.json();
        if (data.cart?.length) {
          setItems((prev) => mergeItems(prev, data.cart));
        }
      } catch { /* non-critical */ }
    })();
  }, [session]);

  // Persist cart to server for logged-in users
  const persist = useCallback(
    async (newItems) => {
      if (!session?.user) return;
      try {
        await fetch('/api/user/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: newItems }),
        });
      } catch { /* non-critical */ }
    },
    [session]
  );

  const addItem = useCallback(
    (product, size, qty = 1) => {
      setItems((prev) => {
        const key  = `${product._id}-${size}`;
        const idx  = prev.findIndex((i) => `${i.productId}-${i.size}` === key);
        let updated;
        if (idx > -1) {
          updated = prev.map((i, ix) =>
            ix === idx ? { ...i, qty: i.qty + qty } : i
          );
        } else {
          updated = [
            ...prev,
            {
              productId:  product._id,
              name:       product.name,
              slug:       product.slug,
              image:      product.images?.[0]?.url,
              priceGBP:   product.priceGBP,
              size,
              qty,
            },
          ];
        }
        persist(updated);
        return updated;
      });
      setIsOpen(true);
      toast.success(`${product.name} added to cart`);
    },
    [persist]
  );

  const removeItem = useCallback(
    (productId, size) => {
      setItems((prev) => {
        const updated = prev.filter(
          (i) => !(i.productId === productId && i.size === size)
        );
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const updateQty = useCallback(
    (productId, size, qty) => {
      if (qty < 1) return removeItem(productId, size);
      setItems((prev) => {
        const updated = prev.map((i) =>
          i.productId === productId && i.size === size ? { ...i, qty } : i
        );
        persist(updated);
        return updated;
      });
    },
    [removeItem, persist]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
    if (session?.user) persist([]);
  }, [session, persist]);

  const totalItems  = items.reduce((s, i) => s + (i.qty || 0), 0);
  const subtotalGBP = items.reduce((s, i) => {
    const price = typeof i.priceGBP === 'number' && isFinite(i.priceGBP) ? i.priceGBP : 0;
    return s + price * (i.qty || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotalGBP, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
