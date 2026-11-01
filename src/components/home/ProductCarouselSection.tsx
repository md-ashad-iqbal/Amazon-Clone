import ProductCarousel from '@/components/product/ProductCarousel';
import { useAsync } from '@/hooks/useAsync';
import type { Product } from '@/types';

interface ProductCarouselSectionProps {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  load: () => Promise<Product[]>;
  deps: unknown[];
  hideIfEmpty?: boolean;
}

export default function ProductCarouselSection({
  title,
  subtitle,
  seeAllHref,
  load,
  deps,
  hideIfEmpty = false,
}: ProductCarouselSectionProps) {
  const { data, error, loading } = useAsync(load, deps);

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
        <h2 className="section-title">{title}</h2>
        <p className="mt-3 text-sm text-rose-700">We could not load this section. Please refresh the page.</p>
      </section>
    );
  }

  if (!loading && hideIfEmpty && (data?.length ?? 0) === 0) return null;

  return (
    <ProductCarousel
      title={title}
      subtitle={subtitle}
      seeAllHref={seeAllHref}
      products={loading ? null : (data ?? [])}
    />
  );
}
