import { Link } from 'react-router-dom';
import ProductImage from '@/components/common/ProductImage';
import { CATEGORIES } from '@/data/categories';
import type { CategoryKey } from '@/types';

const COVER_IMAGES: Record<CategoryKey, string> = {
  electronics: 'https://images.pexels.com/photos/30909364/pexels-photo-30909364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  fashion: 'https://images.pexels.com/photos/4295983/pexels-photo-4295983.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'home-kitchen': 'https://images.pexels.com/photos/35240184/pexels-photo-35240184.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  beauty: 'https://images.pexels.com/photos/39452544/pexels-photo-39452544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  books: 'https://images.pexels.com/photos/8207315/pexels-photo-8207315.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  toys: 'https://images.pexels.com/photos/8435759/pexels-photo-8435759.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  sports: 'https://images.pexels.com/photos/11433027/pexels-photo-11433027.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

export default function CategoryTiles() {
  return (
    <section aria-labelledby="shop-by-category">
      <h2 id="shop-by-category" className="section-title mb-4">
        Shop by category
      </h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {CATEGORIES.map((category) => (
          <li key={category.key}>
            <Link
              to={`/products?category=${category.key}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="block h-28 overflow-hidden bg-slate-100 sm:h-32">
                <ProductImage
                  src={COVER_IMAGES[category.key]}
                  alt=""
                  className="h-full w-full transition duration-500 group-hover:scale-105"
                />
              </span>
              <span className="flex flex-1 items-center justify-between px-3 py-3 text-sm font-semibold text-slate-800">
                {category.label}
                <span aria-hidden className="text-sky-700 transition group-hover:translate-x-0.5">&rsaquo;</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
