import { Flame } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { ResolvedImage } from '@/media/useMediaSettings';

interface CardImageProps {
  image: ResolvedImage;
  onError?: (src: string) => void;
  className?: string;
}

export function CardImage({ image, onError, className = '' }: CardImageProps) {
  if (!image.src) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-red-950 p-2 text-center ${className}`}
      >
        <Flame className="h-5 w-5 shrink-0 text-ember-400" />
        <span className="line-clamp-3 font-display text-sm leading-tight tracking-wide text-charcoal-100">
          {image.label}
        </span>
      </div>
    );
  }

  const style: CSSProperties = { objectPosition: image.position };
  return (
    <img
      src={image.src}
      alt={image.label}
      draggable={false}
      style={style}
      onError={() => onError?.(image.src as string)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
