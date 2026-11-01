import { useCallback, useEffect, useState } from 'react';
import { readStorage, writeStorage } from '@/utils/storage';

const STORAGE_KEY = 'amazon_clone_recently_viewed';
const LEGACY_STORAGE_KEY = 'shopsphere-recently-viewed';
const MAX_ITEMS = 12;

export function useRecentlyViewed(): {
  productIds: string[];
  recordView: (productId: string) => void;
} {
  const [productIds, setProductIds] = useState<string[]>(() => {
    const modern = readStorage<string[]>(STORAGE_KEY, []);
    if (modern.length) return modern.filter((id) => typeof id === 'string');
    return readStorage<string[]>(LEGACY_STORAGE_KEY, []).filter((id) => typeof id === 'string');
  });

  useEffect(() => {
    writeStorage(STORAGE_KEY, productIds);
  }, [productIds]);

  const recordView = useCallback((productId: string) => {
    setProductIds((current) =>
      [productId, ...current.filter((id) => id !== productId)].slice(0, MAX_ITEMS),
    );
  }, []);

  return { productIds, recordView };
}
