import { CATEGORIES } from '@/data/categories';
import type { CategoryKey, ProductListQuery, SortKey } from '@/types';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'bestseller', label: 'Best Sellers' },
];

const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((category) => category.key));
const VALID_SORTS = new Set<string>(SORT_OPTIONS.map((option) => option.value));

function parseNonNegative(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parseProductQuery(params: URLSearchParams): ProductListQuery {
  const category = params.get('category');
  const sort = params.get('sort');
  const brands = params.get('brand')?.split(',').filter(Boolean) ?? [];
  return {
    query: params.get('q') ?? '',
    category: category && VALID_CATEGORIES.has(category) ? (category as CategoryKey) : undefined,
    minPrice: parseNonNegative(params.get('min')),
    maxPrice: parseNonNegative(params.get('max')),
    minRating: parseNonNegative(params.get('rating')),
    minDiscount: parseNonNegative(params.get('discount')),
    dealsOnly: params.get('deals') === '1',
    inStockOnly: params.get('stock') === '1',
    brands: brands.length > 0 ? brands : undefined,
    sort: sort && VALID_SORTS.has(sort) ? (sort as SortKey) : 'featured',
    page: Math.max(1, Math.floor(parseNonNegative(params.get('page')) ?? 1)),
  };
}

export function patchParams(
  current: URLSearchParams,
  patch: Record<string, string | null>,
): URLSearchParams {
  const next = new URLSearchParams(current);
  Object.entries(patch).forEach(([key, value]) => {
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
  });
  if (!('page' in patch)) next.delete('page');
  return next;
}
