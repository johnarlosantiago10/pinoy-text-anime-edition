import { Flame } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { ResolvedImage } from '@/media/useMediaSettings';
import type { Side } from '@/game/types';
import { CardImage } from '@/components/CardImage';

interface PamatoCardProps {
  x: number;
  y: number;
  lift: number;
  spin: number;
  tilt: number;
  result: Side;
  revealed: boolean;
  chaImage: ResolvedImage | null;
  chubTiles: ResolvedImage[];
  onImageError: (src: string) => void;
}

function ChubArt({ tiles, onImageError }: { tiles: ResolvedImage[]; onImageError: (src: string) => void }) {
  const single = tiles.length <= 1;
  return (
    <div className="relative h-full w-full overflow-hidden bg-charcoal-900">
      <div className={`grid h-full w-full ${single ? 'grid-cols-1' : 'grid-cols-2'} gap-px`}>
        {tiles.map((tile, index) => (
          <div key={`${tile.key}-${index}`} className="relative overflow-hidden">
            <CardImage image={tile} onError={onImageError} />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-red-600 mix-blend-multiply opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-950/70 via-transparent to-transparent" />
    </div>
  );
}

function CardBack() {
  return (
    <div className="card-back relative h-full w-full overflow-hidden rounded-[6px] border-2 border-ember-500 bg-charcoal-900">
      <div className="absolute inset-2 rounded-[4px] border border-ember-500/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <Flame className="h-6 w-6 text-ember-400" />
        <span className="font-display text-lg tracking-widest text-ember-300">TEKS</span>
      </div>
    </div>
  );
}

export function PamatoCard({
  x,
  y,
  lift,
  spin,
  tilt,
  result,
  revealed,
  chaImage,
  chubTiles,
  onImageError,
}: PamatoCardProps) {
  const style: CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) translateY(calc(var(--card-h) * ${-lift})) rotateY(${spin}deg) rotateZ(${tilt}deg)`,
  };
  const flipStyle: CSSProperties = {
    transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
    transition: revealed ? 'transform 700ms cubic-bezier(0.34, 1.3, 0.64, 1)' : 'none',
  };

  return (
    <div
      className="absolute h-[var(--card-h)] w-[var(--card-w)] drop-shadow-[0_10px_12px_rgba(0,0,0,0.6)]"
      style={style}
    >
      <div className="relative h-full w-full [transform-style:preserve-3d]" style={flipStyle}>
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <CardBack />
        </div>
        <div
          className={`absolute inset-0 overflow-hidden rounded-[6px] border-2 border-ember-500 bg-charcoal-900 [backface-visibility:hidden] [transform:rotateY(180deg)] ${revealed ? '' : 'invisible'}`}
        >
          {result === 'CHA' && chaImage ? (
            <>
              <CardImage image={chaImage} onError={onImageError} />
              <span className="absolute bottom-1.5 left-1.5 rounded bg-ember-500 px-2 py-0.5 font-display text-sm tracking-widest text-charcoal-950">
                CHA
              </span>
            </>
          ) : result === 'CHUB' ? (
            <>
              <ChubArt tiles={chubTiles} onImageError={onImageError} />
              <span className="absolute bottom-1.5 left-1.5 rounded bg-red-600 px-2 py-0.5 font-display text-sm tracking-widest text-white">
                CHUB
              </span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
