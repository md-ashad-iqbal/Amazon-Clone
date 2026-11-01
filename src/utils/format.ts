export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDiscountPercent(product: { price: number; originalPrice: number }): number {
  if (product.originalPrice <= product.price) return 0;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

export function getDeliveryLabel(deliveryDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + deliveryDays);
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
}
