export type CategoryKey =
  | 'electronics'
  | 'fashion'
  | 'home-kitchen'
  | 'beauty'
  | 'books'
  | 'toys'
  | 'sports';

export interface Category {
  key: CategoryKey;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryKey;
  subcategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  featured: boolean;
  bestSeller: boolean;
  createdAt: string;
  deliveryDays: number;
  tags?: string[];
}

export interface ProductFilters {
  query?: string;
  category?: CategoryKey;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brands?: string[];
  inStockOnly?: boolean;
  minDiscount?: number;
  dealsOnly?: boolean;
}

export type SortKey =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
  | 'bestseller';

export interface ProductListQuery extends ProductFilters {
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export interface ProductListResult {
  items: Product[];
  total: number;
  page: number;
  pageCount: number;
}

export interface CartLine {
  product: Product;
  quantity: number;
  lineTotal: number;
  lineSavings: number;
}

export interface CartSummary {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  savings: number;
  deliveryCharge: number;
  total: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  addresses: Address[];
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'COD' | 'TEST_CHECKOUT';

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Omit<Address, 'id' | 'isDefault'>;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Completed';
  subtotal: number;
  deliveryCharge: number;
  savings: number;
  total: number;
  status: OrderStatus;
  estimatedDeliveryDate: string;
  createdAt: string;
}

