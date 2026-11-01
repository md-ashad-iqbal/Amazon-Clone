import { Star } from 'lucide-react';
import Rating from '@/components/common/Rating';
import { useAsync } from '@/hooks/useAsync';
import { getSampleReviews } from '@/services/productService';
import type { Product } from '@/types';

interface ProductReviewsProps {
  product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const { data, error, loading } = useAsync(() => getSampleReviews(product), [product.id]);

  return (
    <section aria-labelledby="customer-reviews" className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 id="customer-reviews" className="section-title">Customer reviews</h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">{product.rating.toFixed(1)}</span>
            <div>
              <Rating value={product.rating} />
              <p className="mt-1 text-sm text-slate-600">{product.reviewCount.toLocaleString('en-IN')} global ratings</p>
            </div>
          </div>
        </div>
        <p className="max-w-xs rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Sample reviews are generated for this demo catalogue and are not from real shoppers.
        </p>
      </div>

      <div className="mt-6 divide-y divide-slate-200">
        {loading && <p className="py-4 text-sm text-slate-500">Loading reviews...</p>}
        {error && <p className="py-4 text-sm text-rose-700">Reviews could not be loaded.</p>}
        {data?.map((review) => (
          <article key={review.id} className="py-5">
            <div className="flex items-center gap-2">
              <div className="flex" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${index < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{review.title}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{review.body}</p>
            <p className="mt-2 text-xs text-slate-500">
              {review.author} | {review.daysAgo} days ago
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
