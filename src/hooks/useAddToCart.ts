import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

export function useAddToCart() {
  const { addItem } = useCart();

  return (product: Product, quantity = 1) => {
    const result = addItem(product.id, quantity);
    if (result === 'added') {
      toast.success(`Added to cart: ${product.name}`);
    } else if (result === 'limit-reached') {
      toast.error(`Only ${product.stock} available. You already have the maximum in your cart.`);
    } else {
      toast.error('This item is currently out of stock.');
    }
    return result;
  };
}
