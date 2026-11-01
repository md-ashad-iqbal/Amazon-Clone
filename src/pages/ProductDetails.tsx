import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, PackageSearch } from 'lucide-react';
import ProductBuyBox from '@/components/product/ProductBuyBox';
import ProductCarousel from '@/components/product/ProductCarousel';
import ProductGallery from '@/components/product/ProductGallery';
import FrequentlyBought from '@/components/product/FrequentlyBought';
import ProductReviews from '@/components/product/ProductReviews';
import Rating from '@/components/common/Rating';
import { CATEGORY_LABELS } from '@/data/categories';
import { useAsync } from '@/hooks/useAsync';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { getProductById, getRelatedProducts } from '@/services/productService';

export default function ProductDetails() {
  const { productId = '' } = useParams();
  const { recordView } = useRecentlyViewed();

  const product = useAsync(() => getProductById(productId), [productId]);
  const current = product.data;

  const related = useAsync(
    () => (current ? getRelatedProducts(current, 10) : Promise.resolve([])),
    [current?.id],
  );

  useEffect(() => {
    if (current) recordView(current.id);
  }, [current, recordView]);

  if (product.loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]" aria-busy="true">
        <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (product.error || !current) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-slate-200/70">
        <PackageSearch className="mx-auto h-10 w-10 text-slate-400" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">We could not find that product</h1>
        <p className="mt-2 text-sm text-slate-600">It may have been removed, or the link is incorrect.</p>
        <Link to="/products" className="btn-primary mt-6">
          Browse all products
        </Link>
      </div>
    );
  }

  const specEntries = Object.entries(current.specs);

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-slate-600">
        <Link to="/" className="hover:text-sky-800 hover:underline">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/products?category=${current.category}`} className="hover:text-sky-800 hover:underline">
          {CATEGORY_LABELS[current.category]}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-slate-900">{current.subcategory}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
            <ProductGallery images={current.images} name={current.name} />
          </div>

          <section className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
            <h2 className="section-title">About this item</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">{current.description}</p>
            {specEntries.length > 0 && (
              <dl className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl ring-1 ring-slate-200">
                {specEntries.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-2 gap-4 bg-white px-4 py-3 text-sm even:bg-slate-50">
                    <dt className="font-medium text-slate-600">{label}</dt>
                    <dd className="text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          <ProductReviews product={current} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-44 lg:self-start">
          <div>
            <p className="text-sm font-semibold text-sky-800">{current.brand}</p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900">{current.name}</h1>
            <div className="mt-3">
              <Rating value={current.rating} count={current.reviewCount} />
            </div>
          </div>
          <ProductBuyBox product={current} />
        </div>
      </div>

      <FrequentlyBought product={current} />

      <ProductCarousel
        title="Customers also viewed"
        subtitle={`More from ${CATEGORY_LABELS[current.category]}`}
        products={related.data}
        seeAllHref={`/products?category=${current.category}`}
      />
    </div>
  );
}
