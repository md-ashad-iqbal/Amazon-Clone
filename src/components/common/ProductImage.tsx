import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ProductImageProps {
  src: string | undefined;
  alt: string;
  className?: string;
  eager?: boolean;
}

export default function ProductImage({ src, alt, className = '', eager = false }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}
      >
        <ImageOff className="h-8 w-8" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-contain ${className}`}
    />
  );
}
