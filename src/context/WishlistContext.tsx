import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { readStorage, writeStorage } from '@/utils/storage';

const STORAGE_KEY = 'shopsphere-wishlist';

interface WishlistContextValue {
  productIds: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEY, []).filter((id) => typeof id === 'string'),
  );

  useEffect(() => {
    writeStorage(STORAGE_KEY, productIds);
  }, [productIds]);

  const has = useCallback((productId: string) => productIds.includes(productId), [productIds]);

  const toggle = useCallback(
    (productId: string) => {
      const isSaved = productIds.includes(productId);
      setProductIds((current) =>
        isSaved ? current.filter((id) => id !== productId) : [...current, productId],
      );
      return !isSaved;
    },
    [productIds],
  );

  const remove = useCallback((productId: string) => {
    setProductIds((current) => current.filter((id) => id !== productId));
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({ productIds, has, toggle, remove }),
    [productIds, has, toggle, remove],
  );

  return createElement(WishlistContext.Provider, { value }, children);
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
