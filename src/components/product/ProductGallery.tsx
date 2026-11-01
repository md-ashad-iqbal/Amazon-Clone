import { useState } from 'react';
import type { MouseEvent } from 'react';
import ProductImage from '@/components/common/ProductImage';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setZoomOrigin({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row-reverse">
      <div
        onMouseMove={handleMove}
        onMouseLeave={() => setZoomOrigin(null)}
        className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-slate-200"
      >
        <ProductImage
          src={images[activeIndex]}
          alt={name}
          eager
          className="h-full w-full transition-transform duration-200 ease-out"
        />
        {zoomOrigin && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-white"
            style={{
              backgroundImage: `url(${images[activeIndex]})`,
              backgroundSize: '220%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
            }}
          />
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto md:w-20 md:flex-col md:overflow-visible">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show image ${index + 1}`}
            aria-current={index === activeIndex}
            className={`h-20 w-20 flex-none overflow-hidden rounded-lg bg-white p-1 ring-2 transition ${
              index === activeIndex ? 'ring-amber-400' : 'ring-slate-200 hover:ring-slate-400'
            }`}
          >
            <ProductImage src={src} alt="" className="h-full w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
