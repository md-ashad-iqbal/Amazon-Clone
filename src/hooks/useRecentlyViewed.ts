import { useCallback, useEffect, useState } from 'react';
import { readStorage, writeStorage } from '@/utils/storage';

const STORAGE_KEY = 'shopsphere-recently-viewed';
const MAX_ITEMS = 12;

export function useRecentlyViewed(): {
  productIds: string[];
  recordView: (productId: string) => void;
} {
  const [productIds, setProductIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEY, []).filter((id) => typeof id === 'string'),
  );

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
