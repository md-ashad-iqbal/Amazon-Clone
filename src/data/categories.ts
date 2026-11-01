import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { key: 'electronics', label: 'Electronics' },
  { key: 'fashion', label: 'Fashion' },
  { key: 'home-kitchen', label: 'Home & Kitchen' },
  { key: 'beauty', label: 'Beauty' },
  { key: 'books', label: 'Books' },
  { key: 'toys', label: 'Toys' },
  { key: 'sports', label: 'Sports & Fitness' },
];

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((category) => [category.key, category.label]),
) as Record<Category['key'], string>;
