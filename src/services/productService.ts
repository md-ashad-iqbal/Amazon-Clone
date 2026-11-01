import { PRODUCTS, findProductById } from '@/data/products';
import type { Product, ProductListQuery, ProductListResult, SortKey } from '@/types';
import { getDiscountPercent } from '@/utils/format';
import { searchAndRankProducts } from '@/utils/searchEngine';

const DEAL_THRESHOLD = 25;
const DEFAULT_PAGE_SIZE = 12;
const SIMULATED_LATENCY_MS = 180;

function respond<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

function applyFilters(products: Product[], query: ProductListQuery): Product[] {
  let list = products;
  const term = query.query?.trim() ?? '';
  if (term) {
    list = searchAndRankProducts(list, term);
  }
  return list.filter((product) => {
    if (query.category && product.category !== query.category) return false;
    if (query.minPrice !== undefined && product.price < query.minPrice) return false;
    if (query.maxPrice !== undefined && product.price > query.maxPrice) return false;
    if (query.minRating !== undefined && product.rating < query.minRating) return false;
    if (query.brands?.length && !query.brands.includes(product.brand)) return false;
    if (query.inStockOnly && product.stock <= 0) return false;
    if (query.minDiscount && getDiscountPercent(product) < query.minDiscount) return false;
    if (query.dealsOnly && getDiscountPercent(product) < DEAL_THRESHOLD) return false;
    return true;
  });
}

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || b.reviewCount - a.reviewCount,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  bestseller: (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.reviewCount - a.reviewCount,
};

export function listProducts(query: ProductListQuery = {}): Promise<ProductListResult> {
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const hasSearch = Boolean(query.query?.trim());
  let filtered = applyFilters(PRODUCTS, query);

  // If user searched and sort is default ('featured' or undefined), preserve relevance ranking
  if (!hasSearch || (query.sort && query.sort !== 'featured')) {
    filtered = [...filtered].sort(SORTERS[query.sort ?? 'featured']);
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount);
  const start = (page - 1) * pageSize;
  return respond({
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageCount,
  });
}

export function getProductById(id: string): Promise<Product | null> {
  return respond(findProductById(id) ?? null);
}

export function getSearchSuggestions(query: string, limit = 6): Promise<Product[]> {
  const term = query.trim();
  if (!term) return respond([]);
  const matches = searchAndRankProducts(PRODUCTS, term).slice(0, limit);
  return respond(matches);
}

export function getRelatedProducts(product: Product, limit = 10): Promise<Product[]> {
  const related = PRODUCTS.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category,
  )
    .sort(SORTERS.bestseller)
    .slice(0, limit);
  return respond(related);
}

export function getBrands(category?: Product['category']): Promise<string[]> {
  const brands = new Set(
    PRODUCTS.filter((product) => !category || product.category === category).map(
      (product) => product.brand,
    ),
  );
  return respond([...brands].sort((a, b) => a.localeCompare(b)));
}

export function getProductsByIds(ids: string[]): Promise<Product[]> {
  const found = ids
    .map((id) => findProductById(id))
    .filter((product): product is Product => Boolean(product));
  return respond(found);
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  daysAgo: number;
}

const SAMPLE_REVIEWS: Omit<ProductReview, 'id' | 'rating'>[] = [
  { author: 'Aarav S.', title: 'Exactly as described', body: 'Arrived quickly and works just as shown. Good value for the price.', daysAgo: 4 },
  { author: 'Meera K.', title: 'Solid everyday pick', body: 'Using it daily for a few weeks now. No complaints so far.', daysAgo: 19 },
  { author: 'Rohan D.', title: 'Would buy again', body: 'Quality feels better than I expected at this price point.', daysAgo: 42 },
];

export function getSampleReviews(product: Product): Promise<ProductReview[]> {
  const offsets = [0.5, 0, -0.5];
  return respond(
    SAMPLE_REVIEWS.map((review, index) => ({
      ...review,
      id: `${product.id}-review-${index}`,
      rating: Math.min(5, Math.max(1, Math.round(product.rating + offsets[index]))),
    })),
  );
}
