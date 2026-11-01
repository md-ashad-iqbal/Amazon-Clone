import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import FilterPanel from '@/components/products/FilterPanel';
import Pagination from '@/components/products/Pagination';
import ProductCard, { ProductCardSkeleton } from '@/components/product/ProductCard';
import { CATEGORY_LABELS } from '@/data/categories';
import { useAsync } from '@/hooks/useAsync';
import { getBrands, listProducts } from '@/services/productService';
import { SORT_OPTIONS, parseProductQuery, patchParams } from '@/utils/productQuery';

const PAGE_SIZE = 12;
const CLEARABLE_KEYS = ['q', 'category', 'min', 'max', 'rating', 'discount', 'deals', 'stock', 'brand', 'sort'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = useMemo(() => parseProductQuery(searchParams), [searchParams]);
  const paramsKey = searchParams.toString();

  const results = useAsync(
    () => listProducts({ ...query, pageSize: PAGE_SIZE }),
    [paramsKey],
  );
  const brands = useAsync(() => getBrands(query.category), [query.category]);

  const patch = (changes: Record<string, string | null>) =>
    setSearchParams(patchParams(searchParams, changes));

  const clearAll = () => {
    const cleared: Record<string, null> = {};
    CLEARABLE_KEYS.forEach((key) => {
      cleared[key] = null;
    });
    setSearchParams(patchParams(searchParams, cleared));
  };

  const heading = query.query
    ? `Results for "${query.query}"`
    : query.category
      ? CATEGORY_LABELS[query.category]
      : query.dealsOnly
        ? "Today's Deals"
        : 'All products';

  const activeFilterCount = [
    query.category,
    query.minPrice,
    query.maxPrice,
    query.minRating,
    query.minDiscount,
    query.dealsOnly || undefined,
    query.inStockOnly || undefined,
    query.brands?.length ? query.brands : undefined,
  ].filter((value) => value !== undefined).length;

  const data = results.data;

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-44 max-h-[calc(100vh-11rem)] overflow-y-auto rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70">
          <FilterPanel
            category={query.category}
            brands={brands.data ?? []}
            selectedBrands={query.brands ?? []}
            minPrice={query.minPrice}
            maxPrice={query.maxPrice}
            minRating={query.minRating}
            minDiscount={query.minDiscount}
            inStockOnly={Boolean(query.inStockOnly)}
            onPatch={patch}
            onClearAll={clearAll}
          />
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-slate-900">{heading}</h1>
            <p className="mt-1 text-sm text-slate-600" aria-live="polite">
              {data ? `${data.total} ${data.total === 1 ? 'result' : 'results'}` : 'Loading results...'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              className="btn-secondary lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="whitespace-nowrap">Sort by</span>
              <select
                value={query.sort}
                onChange={(event) =>
                  patch({ sort: event.target.value === 'featured' ? null : event.target.value })
                }
                className="rounded-full border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-800 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {filtersOpen && (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 lg:hidden">
            <FilterPanel
              category={query.category}
              brands={brands.data ?? []}
              selectedBrands={query.brands ?? []}
              minPrice={query.minPrice}
              maxPrice={query.maxPrice}
              minRating={query.minRating}
              minDiscount={query.minDiscount}
              inStockOnly={Boolean(query.inStockOnly)}
              onPatch={patch}
              onClearAll={clearAll}
            />
          </div>
        )}

        {query.query && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <Search className="h-4 w-4" />
            <span>Searching for</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-800">
              {query.query}
              <button
                type="button"
                onClick={() => patch({ q: null })}
                aria-label="Clear search"
                className="rounded-full p-0.5 hover:bg-slate-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          </div>
        )}

        {results.loading && (
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}

        {results.error && (
          <p className="rounded-xl bg-rose-50 p-6 text-center text-sm text-rose-700">
            We could not load products right now. Please refresh and try again.
          </p>
        )}

        {data && data.items.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-slate-200/70">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Search className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {query.query ? 'No products found for your search.' : 'No products match these filters'}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              {query.query
                ? `We couldn't find any items matching "${query.query}". Check your spelling or try popular categories below.`
                : 'Try widening your price range, relaxing ratings, or clearing active filters to see everything.'}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="w-full text-xs font-semibold uppercase tracking-wider text-slate-400">
                Popular categories:
              </span>
              {[
                { label: 'Fashion', q: 'fashion' },
                { label: 'Electronics', q: 'electronics' },
                { label: 'Smartphones', q: 'mobile' },
                { label: 'Shirts & T-Shirts', q: 'shirt' },
                { label: 'Jeans & Pants', q: 'pants' },
                { label: 'Ethnic Wear', q: 'kurta' },
                { label: 'Shoes', q: 'shoes' },
                { label: 'Laptops', q: 'laptop' },
                { label: 'Headphones', q: 'headphones' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => patch({ q: item.q, category: null, min: null, max: null })}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button type="button" onClick={clearAll} className="btn-primary mt-6">
              Clear all filters
            </button>
          </div>
        )}

        {data && data.items.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-3">
              {data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              page={data.page}
              pageCount={data.pageCount}
              onChange={(nextPage) => setSearchParams(patchParams(searchParams, { page: String(nextPage) }))}
            />
          </>
        )}
      </section>
    </div>
  );
}
