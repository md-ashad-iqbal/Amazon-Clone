import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductImage from '@/components/common/ProductImage';
import { useCart } from '@/context/CartContext';
import { useAsync } from '@/hooks/useAsync';
import { getRelatedProducts } from '@/services/productService';
import type { Product } from '@/types';
import { formatINR } from '@/utils/format';

interface FrequentlyBoughtProps {
  product: Product;
}

export default function FrequentlyBought({ product }: FrequentlyBoughtProps) {
  const { addItem } = useCart();
  const { data: companions, loading } = useAsync(() => getRelatedProducts(product, 2), [product.id]);

  if (loading || !companions || companions.length === 0) return null;

  const bundle = [product, ...companions];
  const total = bundle.reduce((sum, item) => sum + item.price, 0);

  const addBundle = () => {
    const added = bundle.filter((item) => addItem(item.id, 1) === 'added').length;
    if (added === bundle.length) {
      toast.success(`Added ${added} items to your cart`);
    } else if (added > 0) {
      toast.success(`Added ${added} of ${bundle.length} items. Others are already at their limit.`);
    } else {
      toast.error('These items are already in your cart at their maximum quantity.');
    }
  };

  return (
    <section aria-labelledby="frequently-bought" className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
      <h2 id="frequently-bought" className="section-title">Frequently bought together</h2>
      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center">
        <ul className="flex flex-1 flex-wrap items-center gap-3">
          {bundle.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3">
              {index > 0 && <Plus className="h-4 w-4 text-slate-400" />}
              <div className="w-28">
                <Link to={`/products/${item.id}`} className="block overflow-hidden rounded-lg bg-white p-2 ring-1 ring-slate-200 hover:ring-amber-400">
                  <ProductImage src={item.images[0]} alt={item.name} className="h-24 w-28 object-contain" />
                </Link>
                <Link to={`/products/${item.id}`} className="mt-2 block line-clamp-2 text-xs font-medium text-slate-800 hover:text-sky-700">
                  {item.name}
                </Link>
                <p className="text-xs font-semibold text-slate-900">{formatINR(item.price)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="space-y-3 lg:w-56">
          <p className="text-sm text-slate-700">
            Total for {bundle.length} items: <span className="font-bold text-slate-900">{formatINR(total)}</span>
          </p>
          <button type="button" onClick={addBundle} className="btn-primary w-full">
            Add all {bundle.length} to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
