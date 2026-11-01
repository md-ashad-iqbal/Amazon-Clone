import HeroCarousel from '@/components/home/HeroCarousel';
import AmazonCategoryGrid from '@/components/home/AmazonCategoryGrid';
import CategoryTiles from '@/components/home/CategoryTiles';
import ProductCarouselSection from '@/components/home/ProductCarouselSection';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { getProductsByIds, listProducts } from '@/services/productService';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const byList = (query: Parameters<typeof listProducts>[0]) => () =>
  listProducts({ pageSize: 12, ...query }).then((result) => result.items);

export default function Home() {
  const { productIds } = useRecentlyViewed();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      {/* Promotional Hero Banner Carousel */}
      <HeroCarousel />

      {/* Amazon 2x2 Multi-Quadrant Category Grid (Screenshots 2, 3, 4) */}
      <AmazonCategoryGrid />

      {/* Today's Deals Section */}
      <ProductCarouselSection
        title="Today's Deals"
        subtitle="Limited-time discounts of 25% or more across popular departments"
        seeAllHref="/products?deals=1"
        load={byList({ dealsOnly: true, sort: 'price-asc' })}
        deps={[]}
      />

      {/* Best Sellers */}
      <ProductCarouselSection
        title="Best Sellers"
        subtitle="The products shoppers keep coming back for"
        seeAllHref="/products?sort=bestseller"
        load={byList({ sort: 'bestseller' })}
        deps={[]}
      />

      {/* Personalized Sign-In / Recommendations Prompt (Screenshot 2 bottom) */}
      {!isAuthenticated && (
        <div className="my-2 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-base font-bold text-slate-900">See personalized recommendations</p>
          <div className="mt-3 flex justify-center">
            <Link
              to="/login"
              className="rounded-md bg-amber-400 px-12 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-500 shadow-sm"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            New customer?{' '}
            <Link to="/register" className="font-semibold text-sky-700 hover:underline">
              Start here.
            </Link>
          </p>
        </div>
      )}

      {/* Trending Electronics */}
      <ProductCarouselSection
        title="Trending Electronics"
        subtitle="Laptops, smartphones, audio and workspace gear"
        seeAllHref="/products?category=electronics"
        load={byList({ category: 'electronics', sort: 'rating' })}
        deps={[]}
      />

      {/* Fashion and Lifestyle */}
      <ProductCarouselSection
        title="Fashion and Lifestyle"
        subtitle="Curated dresses, casual shirts, sneakers and bags"
        seeAllHref="/products?category=fashion"
        load={byList({ category: 'fashion', sort: 'featured' })}
        deps={[]}
      />

      {/* Home and Kitchen */}
      <ProductCarouselSection
        title="Home and Kitchen"
        subtitle="Coffee makers, premium seating, and interior essentials"
        seeAllHref="/products?category=home-kitchen"
        load={byList({ category: 'home-kitchen', sort: 'featured' })}
        deps={[]}
      />

      {/* Beauty and Personal Care */}
      <ProductCarouselSection
        title="Beauty and Personal Care"
        subtitle="Skincare serums, hydration kits, and body essentials"
        seeAllHref="/products?category=beauty"
        load={byList({ category: 'beauty', sort: 'rating' })}
        deps={[]}
      />

      {/* Books and Learning */}
      <ProductCarouselSection
        title="Books and Learning"
        subtitle="Top-rated classics, technology handbooks, and strategy games"
        seeAllHref="/products?category=books"
        load={byList({ category: 'books', sort: 'bestseller' })}
        deps={[]}
      />

      {/* Department Quick Tiles */}
      <CategoryTiles />

      {/* Recently Viewed Products */}
      <ProductCarouselSection
        title="Recently Viewed Products"
        subtitle="Pick up where you left off"
        load={() => getProductsByIds(productIds)}
        deps={[productIds.join(',')]}
        hideIfEmpty
      />
    </div>
  );
}
