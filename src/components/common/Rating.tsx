import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  className?: string;
}

export default function Rating({ value, count, className = '' }: RatingProps) {
  const filled = Math.round(value);
  return (
    <div className={`flex items-center gap-1.5 text-xs text-slate-600 ${className}`}>
      <div className="flex" role="img" aria-label={`Rated ${value} out of 5`}>
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`h-3.5 w-3.5 ${index < filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sky-700 hover:underline">{count.toLocaleString('en-IN')}</span>
      )}
    </div>
  );
}
