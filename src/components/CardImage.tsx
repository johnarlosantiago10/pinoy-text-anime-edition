import { Flame } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import type { ResolvedImage } from '@/media/useMediaSettings';

interface CardImageProps {
  image: ResolvedImage;
  onError?: (src: string) => void;
  className?: string;
  hideLabel?: boolean;
}

export function CardImage({ image, onError, className = '', hideLabel = false }: CardImageProps) {
  const [displaySrc, setDisplaySrc] = useState(image.src);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    setDisplaySrc(image.src);
    setUsingFallback(false);
  }, [image.key, image.src]);

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
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <img
        src={displaySrc ?? image.src}
        alt={image.label}
        draggable={false}
        style={style}
        onError={() => {
          if (!usingFallback && image.fallbackSrc) {
            setUsingFallback(true);
            setDisplaySrc(image.fallbackSrc);
            return;
          }
          onError?.(displaySrc as string);
        }}
        className="h-full w-full scale-110 object-contain"
      />
      {!hideLabel && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/85 to-transparent px-1.5 pb-1 pt-5 text-center font-display text-[clamp(0.65rem,2.5vw,0.8rem)] leading-tight text-white">
          {image.label}
        </span>
      )}
    </div>
  );
}
