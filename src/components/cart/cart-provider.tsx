"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  variantId: number;
  productSlug: string;
  productName: string;
  variantLabel: string;
  price: string;
  image: string | null;
  quantity: number;
  /** Stock disponible cuando se añadió; el backend vuelve a comprobarlo al pedir. */
  maxQuantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (variantId: number, quantity: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "stockfy-cart";
// Máximo por línea que acepta POST /api/orders/.
const MAX_PER_LINE = 100;

const CartContext = createContext<CartContextValue | null>(null);

function clamp(quantity: number, max: number) {
  return Math.max(1, Math.min(quantity, max, MAX_PER_LINE));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // Carrito corrupto o almacenamiento bloqueado: se empieza vacío.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Sin almacenamiento el carrito dura lo que dure la pestaña.
    }
  }, [items, ready]);

  const add = useCallback<CartContextValue["add"]>((item, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.variantId === item.variantId);
      if (existing) {
        return current.map((i) =>
          i.variantId === item.variantId
            ? { ...i, ...item, quantity: clamp(i.quantity + quantity, item.maxQuantity) }
            : i,
        );
      }
      return [...current, { ...item, quantity: clamp(quantity, item.maxQuantity) }];
    });
  }, []);

  const setQuantity = useCallback((variantId: number, quantity: number) => {
    setItems((current) =>
      current.map((i) =>
        i.variantId === variantId ? { ...i, quantity: clamp(quantity, i.maxQuantity) } : i,
      ),
    );
  }, []);

  const remove = useCallback((variantId: number) => {
    setItems((current) => current.filter((i) => i.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [items, ready, add, setQuantity, remove, clear],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return context;
}
