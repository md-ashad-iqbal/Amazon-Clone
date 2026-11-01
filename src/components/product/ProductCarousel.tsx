import { useRef } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard, { ProductCardSkeleton } from '@/components/product/ProductCard';
import type { Product } from '@/types';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[] | null;
  seeAllHref?: string;
  emptyMessage?: ReactNode;
}

export default function ProductCarousel({
  title,
  subtitle,
  products,
  seeAllHref,
  emptyMessage = 'No products to show yet.',
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 md:p-6">
      <header className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {seeAllHref && (
            <Link to={seeAllHref} className="whitespace-nowrap text-sm font-semibold text-sky-700 hover:text-sky-900 hover:underline">
              See all
            </Link>
          )}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label={`Scroll ${title} left`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label={`Scroll ${title} right`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {products === null && (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="w-[200px] flex-none sm:w-[230px]">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {products !== null && products.length === 0 && (
        <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-600">{emptyMessage}</p>
      )}

      {products !== null && products.length > 0 && (
        <div
          ref={trackRef}
          className="scrollbar-hide -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[200px] flex-none snap-start sm:w-[230px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
