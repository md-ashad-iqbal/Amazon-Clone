import { useState } from 'react';
import { Star, MessageSquarePlus } from 'lucide-react';
import Rating from '@/components/common/Rating';
import { useAsync } from '@/hooks/useAsync';
import { getSampleReviews, ProductReview } from '@/services/productService';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductReviewsProps {
  product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const { data: initialReviews, error, loading } = useAsync(() => getSampleReviews(product), [product.id]);
  const [userReviews, setUserReviews] = useState<ProductReview[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');

  const allReviews = [...userReviews, ...(initialReviews || [])];

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error('Please enter a review title and comment.');
      return;
    }

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: author.trim() || 'Verified Customer',
      rating,
      title: title.trim(),
      body: body.trim(),
      daysAgo: 0,
    };

    setUserReviews((prev) => [newRev, ...prev]);
    setTitle('');
    setBody('');
    setAuthor('');
    setFormOpen(false);
    toast.success('Your review has been submitted!');
  };

  return (
    <section aria-labelledby="customer-reviews" className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 id="customer-reviews" className="section-title">Customer reviews</h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">{product.rating.toFixed(1)}</span>
            <div>
              <Rating value={product.rating} />
              <p className="mt-1 text-sm text-slate-600">
                {(product.reviewCount + userReviews.length).toLocaleString('en-IN')} global ratings
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setFormOpen((prev) => !prev)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-50 shadow-xs"
          >
            <MessageSquarePlus className="h-4 w-4 text-amber-600" />
            {formOpen ? 'Close Review Form' : 'Write a customer review'}
          </button>
        </div>
      </div>

      {formOpen && (
        <form onSubmit={handleAddReview} className="mt-6 rounded-xl bg-slate-50 p-5 ring-1 ring-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Write your review</h3>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700">Rating</label>
            <div className="mt-1 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} stars`}
                  className="p-1 focus:outline-hidden"
                >
                  <Star
                    className={`h-6 w-6 transition ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-slate-700">{rating} out of 5 stars</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Your name (optional)</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Rahul S."
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Review headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's most important to know?"
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Detailed written review</label>
            <textarea
              required
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What did you like or dislike? What did you use this product for?"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-amber-400 px-5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-500"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 divide-y divide-slate-200">
        {loading && <p className="py-4 text-sm text-slate-500">Loading reviews...</p>}
        {error && <p className="py-4 text-sm text-rose-700">Reviews could not be loaded.</p>}
        {allReviews.map((review) => (
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
              {review.author} | {review.daysAgo === 0 ? 'Today' : `${review.daysAgo} days ago`}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
