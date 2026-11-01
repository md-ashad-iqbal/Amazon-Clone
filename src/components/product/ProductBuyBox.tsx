import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import WishlistButton from '@/components/product/WishlistButton';
import { useAddToCart } from '@/hooks/useAddToCart';
import type { Product } from '@/types';
import { formatINR, getDeliveryLabel, getDiscountPercent } from '@/utils/format';
import Rating from '@/components/common/Rating';

const MAX_QUANTITY_SELECT = 10;

interface ProductBuyBoxProps {
  product: Product;
}

export default function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  const discount = getDiscountPercent(product);
  const maxQuantity = Math.min(product.stock, MAX_QUANTITY_SELECT);
  const outOfStock = product.stock <= 0;

  const stockMessage =
    product.stock <= 0
      ? { text: 'Currently unavailable', className: 'text-rose-700' }
      : product.stock <= 5
        ? { text: `Only ${product.stock} left in stock`, className: 'text-rose-600' }
        : { text: 'In stock', className: 'text-emerald-700' };

  const handleBuyNow = () => {
    if (addToCart(product, quantity) === 'added') navigate('/cart');
  };

  return (
    <div className="space-y-5 rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
      <div>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-3xl font-bold text-slate-900">{formatINR(product.price)}</span>
          {discount > 0 && <span className="text-sm font-semibold text-emerald-700">-{discount}%</span>}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          M.R.P.: <span className="line-through">{formatINR(product.originalPrice)}</span>
        </p>
        <p className="text-xs text-slate-500">Inclusive of all taxes</p>
      </div>

      <div className="space-y-2 text-sm">
        <p className="flex items-start gap-2 text-slate-700">
          <Truck className="mt-0.5 h-4 w-4 flex-none text-sky-700" />
          <span>
            Delivery by <span className="font-semibold text-slate-900">{getDeliveryLabel(product.deliveryDays)}</span>
          </span>
        </p>
        <p className={`font-semibold ${stockMessage.className}`}>{stockMessage.text}</p>
      </div>

      {!outOfStock && (
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <span className="font-medium">Quantity</span>
          <select
            value={Math.min(quantity, maxQuantity)}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 font-medium focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            {Array.from({ length: maxQuantity }, (_, index) => index + 1).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => addToCart(product, quantity)}
          disabled={outOfStock}
          className="btn-primary w-full"
        >
          Add to Cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="w-full rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Buy Now
        </button>
        <WishlistButton product={product} variant="button" />
      </div>

      <div className="flex items-start gap-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-emerald-700" />
        <div>
          <p>Ships from and sold by ShopSphere Demo Warehouse.</p>
          <div className="mt-1">
            <Rating value={product.rating} />
          </div>
        </div>
      </div>
    </div>
  );
}
