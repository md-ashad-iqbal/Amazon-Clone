import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { CATEGORIES } from '@/data/categories';
import type { CategoryKey } from '@/types';

interface FilterPanelProps {
  category: CategoryKey | undefined;
  brands: string[];
  selectedBrands: string[];
  minPrice: number | undefined;
  maxPrice: number | undefined;
  minRating: number | undefined;
  minDiscount: number | undefined;
  inStockOnly: boolean;
  onPatch: (patch: Record<string, string | null>) => void;
  onClearAll: () => void;
}

const RATING_OPTIONS = [
  { value: 4, label: '4 stars & up' },
  { value: 3, label: '3 stars & up' },
  { value: 2, label: '2 stars & up' },
];

const DISCOUNT_OPTIONS = [
  { value: 10, label: '10% off or more' },
  { value: 25, label: '25% off or more' },
  { value: 40, label: '40% off or more' },
];

const radioClass = 'h-4 w-4 accent-navy-900';

export default function FilterPanel({
  category,
  brands,
  selectedBrands,
  minPrice,
  maxPrice,
  minRating,
  minDiscount,
  inStockOnly,
  onPatch,
  onClearAll,
}: FilterPanelProps) {
  const [minInput, setMinInput] = useState(minPrice?.toString() ?? '');
  const [maxInput, setMaxInput] = useState(maxPrice?.toString() ?? '');

  useEffect(() => {
    setMinInput(minPrice?.toString() ?? '');
    setMaxInput(maxPrice?.toString() ?? '');
  }, [minPrice, maxPrice]);

  const applyPrice = (event: FormEvent) => {
    event.preventDefault();
    const min = Number(minInput);
    const max = Number(maxInput);
    const validMin = minInput !== '' && Number.isFinite(min) && min >= 0 ? String(min) : null;
    const validMax = maxInput !== '' && Number.isFinite(max) && max >= 0 ? String(max) : null;
    const lowerBound = validMin !== null && validMax !== null ? Math.min(min, max) : null;
    const upperBound = validMin !== null && validMax !== null ? Math.max(min, max) : null;
    onPatch({
      min: lowerBound !== null ? String(lowerBound) : validMin,
      max: upperBound !== null ? String(upperBound) : validMax,
    });
  };

  const toggleBrand = (brand: string) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((item) => item !== brand)
      : [...selectedBrands, brand];
    onPatch({ brand: next.length ? next.join(',') : null });
  };

  return (
    <div className="space-y-7 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Filters</h2>
        <button type="button" onClick={onClearAll} className="font-semibold text-sky-700 hover:underline">
          Clear all
        </button>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-semibold text-slate-900">Category</legend>
        <label className="flex cursor-pointer items-center gap-2 text-slate-700">
          <input type="radio" name="category" className={radioClass} checked={!category} onChange={() => onPatch({ category: null })} />
          All categories
        </label>
        {CATEGORIES.map((item) => (
          <label key={item.key} className="flex cursor-pointer items-center gap-2 text-slate-700">
            <input
              type="radio"
              name="category"
              className={radioClass}
              checked={category === item.key}
              onChange={() => onPatch({ category: item.key })}
            />
            {item.label}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-semibold text-slate-900">Price (INR)</legend>
        <form onSubmit={applyPrice} className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            aria-label="Minimum price"
            value={minInput}
            onChange={(event) => setMinInput(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <span className="text-slate-400">to</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            aria-label="Maximum price"
            value={maxInput}
            onChange={(event) => setMaxInput(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <button type="submit" className="btn-secondary px-3 py-1.5">
            Go
          </button>
        </form>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-semibold text-slate-900">Customer rating</legend>
        <label className="flex cursor-pointer items-center gap-2 text-slate-700">
          <input type="radio" name="rating" className={radioClass} checked={!minRating} onChange={() => onPatch({ rating: null })} />
          Any rating
        </label>
        {RATING_OPTIONS.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-2 text-slate-700">
            <input
              type="radio"
              name="rating"
              className={radioClass}
              checked={minRating === option.value}
              onChange={() => onPatch({ rating: String(option.value) })}
            />
            {option.label}
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-semibold text-slate-900">Discount</legend>
        <label className="flex cursor-pointer items-center gap-2 text-slate-700">
          <input type="radio" name="discount" className={radioClass} checked={!minDiscount} onChange={() => onPatch({ discount: null, deals: null })} />
          Any discount
        </label>
        {DISCOUNT_OPTIONS.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-2 text-slate-700">
            <input
              type="radio"
              name="discount"
              className={radioClass}
              checked={minDiscount === option.value}
              onChange={() => onPatch({ discount: String(option.value) })}
            />
            {option.label}
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-semibold text-slate-900">Availability</legend>
        <label className="flex cursor-pointer items-center gap-2 text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 accent-navy-900"
            checked={inStockOnly}
            onChange={(event) => onPatch({ stock: event.target.checked ? '1' : null })}
          />
          In stock only
        </label>
      </fieldset>

      {brands.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="mb-2 font-semibold text-slate-900">Brand</legend>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2 text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-navy-900"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
