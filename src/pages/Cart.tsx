import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import ProductImage from '@/components/common/ProductImage';
import { FREE_DELIVERY_MINIMUM, useCart } from '@/context/CartContext';
import type { CartLine } from '@/types';
import { formatINR, getDeliveryLabel } from '@/utils/format';

export default function Cart() {
  const { lines, itemCount, subtotal, savings, deliveryCharge, total, setQuantity, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-slate-200/70">
        <ShoppingCart className="mx-auto h-12 w-12 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-600">Browse our catalogue and add something you love.</p>
        <Link to="/products" className="btn-primary mt-6">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_MINIMUM - subtotal);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <section aria-labelledby="cart-heading" className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <h1 id="cart-heading" className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
          <span className="text-sm text-slate-600">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
        </div>

        {amountToFreeDelivery > 0 && (
          <p className="mt-4 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900">
            Add {formatINR(amountToFreeDelivery)} more to get FREE delivery.
          </p>
        )}

        <ul className="divide-y divide-slate-200">
          {lines.map((line) => (
            <CartRow
              key={line.product.id}
              line={line}
              onQuantityChange={(quantity) => setQuantity(line.product.id, quantity)}
              onRemove={() => removeItem(line.product.id)}
            />
          ))}
        </ul>
      </section>

      <aside className="h-fit space-y-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70 lg:sticky lg:top-44">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-700">
            <dt>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</dt>
            <dd className="font-semibold text-slate-900">{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-slate-700">
            <dt>Delivery</dt>
            <dd className="font-semibold text-slate-900">{deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}</dd>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-emerald-700">
              <dt>You save</dt>
              <dd className="font-semibold">-{formatINR(savings)}</dd>
            </div>
          )}
        </dl>
        <div className="flex justify-between border-t border-slate-200 pt-4 text-base">
          <span className="font-semibold text-slate-900">Order total</span>
          <span className="text-lg font-bold text-slate-900">{formatINR(total)}</span>
        </div>
        <p className="text-xs text-slate-500">Estimated delivery: {getDeliveryLabel(Math.max(...lines.map((line) => line.product.deliveryDays)))}</p>
        <Link
          to="/checkout"
          className="block w-full text-center rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-500 shadow-sm"
        >
          Proceed to Checkout
        </Link>
        <p className="text-center text-xs text-slate-500">Safe and simulated demonstration checkout.</p>
        <Link to="/products" className="block text-center text-sm font-semibold text-sky-800 hover:underline">
          Continue Shopping
        </Link>
      </aside>
    </div>
  );
}

interface CartRowProps {
  line: CartLine;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

function CartRow({ line, onQuantityChange, onRemove }: CartRowProps) {
  const { product, quantity, lineTotal } = line;
  const atLimit = quantity >= product.stock;

  return (
    <li className="flex gap-4 py-5">
      <Link to={`/products/${product.id}`} className="h-24 w-24 flex-none overflow-hidden rounded-xl bg-white p-2 ring-1 ring-slate-200">
        <ProductImage src={product.images[0]} alt={product.name} className="h-full w-full" />
      </Link>

      <div className="min-w-0 flex-1 space-y-2">
        <Link to={`/products/${product.id}`} className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-sky-800">
          {product.name}
        </Link>
        <p className="text-xs text-slate-500">{product.brand}</p>
        <p className={`text-xs font-medium ${product.stock <= 5 ? 'text-rose-600' : 'text-emerald-700'}`}>
          {product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <div className="inline-flex items-center rounded-full border border-slate-300 bg-white">
            <button
              type="button"
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              aria-label={`Decrease quantity of ${product.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-l-full text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={atLimit}
              aria-label={`Increase quantity of ${product.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-r-full text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button type="button" onClick={onRemove} className="flex items-center gap-1 text-xs font-semibold text-sky-800 hover:text-rose-700 hover:underline">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      <p className="flex-none text-sm font-bold text-slate-900">{formatINR(lineTotal)}</p>
    </li>
  );
}
