import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { findProductById } from '@/data/products';
import type { CartLine, CartSummary } from '@/types';
import { readStorage, writeStorage } from '@/utils/storage';

const STORAGE_KEY = 'amazon_clone_cart';
const LEGACY_STORAGE_KEY = 'shopsphere-cart';
const FREE_DELIVERY_THRESHOLD = 499;
const STANDARD_DELIVERY_CHARGE = 49;

interface StoredCartItem {
  productId: string;
  quantity: number;
}

export type AddToCartResult = 'added' | 'out-of-stock' | 'limit-reached';

interface CartContextValue extends CartSummary {
  addItem: (productId: string, quantity?: number) => AddToCartResult;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): StoredCartItem[] {
  let stored = readStorage<StoredCartItem[]>(STORAGE_KEY, []);
  if (!stored || stored.length === 0) {
    stored = readStorage<StoredCartItem[]>(LEGACY_STORAGE_KEY, []);
  }
  return stored.filter(
    (entry) =>
      typeof entry.productId === 'string' &&
      typeof entry.quantity === 'number' &&
      entry.quantity > 0 &&
      Boolean(findProductById(entry.productId)),
  );
}

function clampQuantity(quantity: number, stock: number): number {
  return Math.max(1, Math.min(Math.floor(quantity), stock));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoredCartItem[]>(loadCart);

  useEffect(() => {
    writeStorage(STORAGE_KEY, items);
  }, [items]);

  const addItem = useCallback(
    (productId: string, quantity = 1): AddToCartResult => {
      const product = findProductById(productId);
      if (!product || product.stock <= 0) return 'out-of-stock';
      const currentQuantity = items.find((entry) => entry.productId === productId)?.quantity ?? 0;
      if (currentQuantity >= product.stock) return 'limit-reached';
      const nextQuantity = Math.min(currentQuantity + quantity, product.stock);
      setItems((current) =>
        current.some((entry) => entry.productId === productId)
          ? current.map((entry) =>
              entry.productId === productId ? { ...entry, quantity: nextQuantity } : entry,
            )
          : [...current, { productId, quantity: nextQuantity }],
      );
      return 'added';
    },
    [items],
  );

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const product = findProductById(productId);
    if (!product) return;
    setItems((current) =>
      current.map((entry) =>
        entry.productId === productId
          ? { ...entry, quantity: clampQuantity(quantity, product.stock) }
          : entry,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((entry) => entry.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const summary = useMemo<CartSummary>(() => {
    const lines: CartLine[] = items.flatMap((entry) => {
      const product = findProductById(entry.productId);
      if (!product) return [];
      return [
        {
          product,
          quantity: entry.quantity,
          lineTotal: product.price * entry.quantity,
          lineSavings: Math.max(0, product.originalPrice - product.price) * entry.quantity,
        },
      ];
    });
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const savings = lines.reduce((sum, line) => sum + line.lineSavings, 0);
    const deliveryCharge =
      lines.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_CHARGE;
    return {
      lines,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal,
      savings,
      deliveryCharge,
      total: subtotal + deliveryCharge,
    };
  }, [items]);

  const getQuantity = useCallback(
    (productId: string) => items.find((entry) => entry.productId === productId)?.quantity ?? 0,
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({ ...summary, addItem, setQuantity, removeItem, clearCart, getQuantity }),
    [summary, addItem, setQuantity, removeItem, clearCart, getQuantity],
  );

  return createElement(CartContext.Provider, { value }, children);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FREE_DELIVERY_MINIMUM = FREE_DELIVERY_THRESHOLD;
