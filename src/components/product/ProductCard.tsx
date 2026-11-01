import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ProductImage from '@/components/common/ProductImage';
import Rating from '@/components/common/Rating';
import WishlistButton from '@/components/product/WishlistButton';
import { useAddToCart } from '@/hooks/useAddToCart';
import type { Product } from '@/types';
import { formatINR, getDeliveryLabel, getDiscountPercent } from '@/utils/format';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const discount = getDiscountPercent(product);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const freeDelivery = product.price >= 499;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative">
        <Link
          to={`/products/${product.id}`}
          className="block aspect-square overflow-hidden bg-white p-4"
        >
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full transition duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute right-3 top-3">
          <WishlistButton product={product} />
        </div>
        {discount >= 25 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            Deal
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{product.brand}</p>
        <Link
          to={`/products/${product.id}`}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-slate-900 hover:text-sky-700"
        >
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} />

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-lg font-bold text-slate-900">{formatINR(product.price)}</span>
          <span className="text-xs text-slate-500 line-through">{formatINR(product.originalPrice)}</span>
          {discount > 0 && (
            <span className="text-xs font-semibold text-emerald-700">-{discount}%</span>
          )}
        </div>

        <p className="text-xs text-slate-600">
          {freeDelivery ? 'FREE delivery' : 'Delivery'} by{' '}
          <span className="font-semibold text-slate-800">{getDeliveryLabel(product.deliveryDays)}</span>
        </p>
        {lowStock && <p className="text-xs font-semibold text-rose-600">Only {product.stock} left</p>}

        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={outOfStock}
          className="btn-primary mt-auto w-full"
        >
          <ShoppingCart className="h-4 w-4" />
          {outOfStock ? 'Out of stock' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="aspect-square bg-slate-100" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-3 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-5/6 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
        <div className="mt-auto h-9 w-full rounded-full bg-slate-200" />
      </div>
    </div>
  );
}
