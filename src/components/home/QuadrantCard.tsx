import { Link } from 'react-router-dom';
import ProductImage from '@/components/common/ProductImage';
import { ChevronRight } from 'lucide-react';

export interface QuadrantItem {
  label: string;
  image: string;
  href: string;
}

export interface QuadrantCardProps {
  title: string;
  items: [QuadrantItem, QuadrantItem, QuadrantItem, QuadrantItem];
  seeAllHref: string;
  seeAllLabel?: string;
}

export default function QuadrantCard({
  title,
  items,
  seeAllHref,
  seeAllLabel = 'See more',
}: QuadrantCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 transition duration-200 hover:shadow-md">
      <div>
        <Link
          to={seeAllHref}
          className="group flex items-center justify-between text-lg font-bold tracking-tight text-slate-900 hover:text-amber-700"
        >
          <span className="line-clamp-1">{title}</span>
          <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* 2x2 Quadrant Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {items.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className="group flex flex-col transition hover:opacity-95"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/50">
                <ProductImage
                  src={item.image}
                  alt={item.label}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <span className="mt-1.5 line-clamp-1 text-xs font-medium text-slate-800 group-hover:text-amber-700">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-2">
        <Link
          to={seeAllHref}
          className="text-xs font-semibold text-sky-700 hover:text-amber-700 hover:underline"
        >
          {seeAllLabel}
        </Link>
      </div>
    </div>
  );
}
