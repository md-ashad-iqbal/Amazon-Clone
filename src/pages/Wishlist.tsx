import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductImage from '@/components/common/ProductImage';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAsync } from '@/hooks/useAsync';
import { getProductsByIds } from '@/services/productService';
import type { Product } from '@/types';
import { formatINR, getDiscountPercent } from '@/utils/format';

export default function Wishlist() {
  const { productIds, remove } = useWishlist();
  const { addItem } = useCart();
  const idsKey = productIds.join(',');

  const saved = useAsync(() => getProductsByIds(productIds), [idsKey]);

  if (saved.loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    );
  }

  if (saved.error) {
    return (
      <p className="rounded-xl bg-rose-50 p-6 text-center text-sm text-rose-700">
        We could not load your wishlist right now. Please refresh and try again.
      </p>
    );
  }

  const products = saved.data ?? [];

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-slate-200/70">
        <Heart className="mx-auto h-12 w-12 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-slate-600">Tap the heart on any product to save it here for later.</p>
        <Link to="/products" className="btn-primary mt-6">
          Browse products
        </Link>
      </div>
    );
  }

  const moveToCart = (product: Product) => {
    if (addItem(product.id, 1) === 'added') {
      remove(product.id);
      toast.success(`Moved to cart: ${product.name}`);
    } else {
      toast.error('This item is out of stock or already at its limit in your cart.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your Wishlist</h1>
        <span className="text-sm text-slate-600">{products.length} {products.length === 1 ? 'item' : 'items'}</span>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const discount = getDiscountPercent(product);
          const unavailable = product.stock <= 0;
          return (
            <li key={product.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lift">
              <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <ProductImage src={product.images[0]} alt={product.name} className="h-full w-full" />
              </Link>
              <div className="mt-4 flex-1 space-y-1">
                <Link to={`/products/${product.id}`} className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-sky-800">
                  {product.name}
                </Link>
                <p className="text-xs text-slate-500">{product.brand}</p>
                <p className="pt-1 text-base font-bold text-slate-900">
                  {formatINR(product.price)}
                  {discount > 0 && <span className="ml-2 text-xs font-semibold text-emerald-700">-{discount}%</span>}
                </p>
                <p className={`text-xs font-medium ${unavailable ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {unavailable ? 'Currently unavailable' : 'In stock'}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => moveToCart(product)} disabled={unavailable} className="btn-primary flex-1 text-xs">
                  <ShoppingCart className="h-4 w-4" />
                  Move to Cart
                </button>
                <button
                  type="button"
                  onClick={() => {
                    remove(product.id);
                    toast.success('Removed from wishlist');
                  }}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-rose-300 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
