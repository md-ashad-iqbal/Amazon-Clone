import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWishlist } from '@/context/WishlistContext';
import type { Product } from '@/types';

interface WishlistButtonProps {
  product: Product;
  variant?: 'icon' | 'button';
}

export default function WishlistButton({ product, variant = 'icon' }: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);

  const handleClick = () => {
    const added = toggle(product.id);
    toast.success(added ? `Saved to wishlist: ${product.name}` : `Removed from wishlist`);
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        className="btn-secondary w-full"
      >
        <Heart className={`h-4 w-4 transition ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
        {saved ? 'Saved to Wishlist' : 'Add to Wishlist'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:scale-110 hover:text-rose-500"
    >
      <Heart className={`h-4 w-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
    </button>
  );
}
