import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { getSearchSuggestions } from '@/services/productService';
import type { Product } from '@/types';
import { formatINR } from '@/utils/format';
import ProductImage from '@/components/common/ProductImage';

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const urlCategory = searchParams.get('category') ?? '';

  const [query, setQuery] = useState(urlQuery);
  const [category, setCategory] = useState(urlCategory);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      getSearchSuggestions(query, 6).then((results) => {
        if (active) setSuggestions(results);
      });
    }, 200);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const params = new URLSearchParams();
    const term = query.trim();
    if (term) params.set('q', term);
    if (category) params.set('category', category);
    setOpen(false);
    navigate(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const showSuggestions = open && query.trim().length > 0 && suggestions.length > 0;

  return (
    <form
      ref={containerRef}
      onSubmit={submit}
      role="search"
      className="relative flex w-full items-stretch overflow-visible rounded-lg bg-white shadow-sm ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-amber-400"
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <label className="sr-only" htmlFor="search-category">
        Search category
      </label>
      <select
        id="search-category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        className="hidden max-w-[9rem] cursor-pointer rounded-l-lg border-r border-slate-200 bg-slate-100 px-2 text-xs font-medium text-slate-700 focus:outline-none md:block"
      >
        <option value="">All</option>
        {CATEGORIES.map((item) => (
          <option key={item.key} value={item.key}>
            {item.label}
          </option>
        ))}
      </select>

      <div className="relative flex flex-1 items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpen(false);
          }}
          placeholder="Search products, brands and more"
          aria-label="Search products"
          aria-autocomplete="list"
          className="h-10 w-full bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            aria-label="Clear search"
            className="mr-2 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        type="submit"
        aria-label="Search"
        className="flex w-11 items-center justify-center rounded-r-lg bg-amber-400 text-navy-900 transition hover:bg-amber-300"
      >
        <Search className="h-5 w-5" />
      </button>

      {showSuggestions && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lift">
          {suggestions.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  navigate(`/product/${product.id}`);
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-slate-100"
              >
                <ProductImage src={product.images[0]} alt="" className="h-10 w-10 flex-none rounded bg-white" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">{product.name}</span>
                  <span className="text-xs text-slate-500">
                    {product.brand} | {formatINR(product.price)}
                  </span>
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => submit()}
              className="w-full border-t border-slate-100 px-3 py-2 text-left text-sm font-semibold text-sky-700 hover:bg-slate-50"
            >
              See all results for "{query.trim()}"
            </button>
          </li>
        </ul>
      )}
    </form>
  );
}
