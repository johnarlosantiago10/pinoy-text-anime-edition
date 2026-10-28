import { Flame } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Side } from '@/game/types';
import { CardImage } from '@/components/CardImage';
import type { ResolvedImage } from '@/media/useMediaSettings';

interface PamatoCardProps {
  x: number;
  y: number;
  lift: number;
  spin: number;
  tilt: number;
  result: Side;
  revealed: boolean;
  winnerName?: string;
  winnerAmount?: number;
  isWinner?: boolean;
  pamato: ResolvedImage | null;
}

function CardBack() {
  return (
    <div className="card-back relative h-full w-full overflow-hidden rounded-[6px] border-2 border-ember-500 bg-charcoal-900">
      <div className="absolute inset-2 rounded-[4px] border border-ember-500/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <Flame className="h-6 w-6 text-ember-400" />
        <span className="font-display text-2xl tracking-widest text-ember-300 sm:text-3xl">TEKS</span>
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
  winnerName,
  winnerAmount,
  isWinner = false,
  pamato,
}: PamatoCardProps) {
  const style: CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) translateY(calc(var(--card-h) * ${-lift})) rotateY(${spin}deg) rotateZ(${tilt}deg) scale(${isWinner ? 1.45 : 1})`,
    transition: 'left 900ms ease-in-out, top 900ms ease-in-out, transform 900ms cubic-bezier(0.34, 1.25, 0.64, 1)',
    zIndex: isWinner ? 20 : 10,
  };
  const flipStyle: CSSProperties = {
    transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
    transition: revealed ? 'transform 700ms 180ms cubic-bezier(0.34, 1.3, 0.64, 1)' : 'none',
  };

  return (
    <div
      className={`absolute h-[var(--card-h)] w-[var(--card-w)] drop-shadow-[0_10px_12px_rgba(0,0,0,0.6)] ${isWinner ? 'winner-card-glow' : ''}`}
      style={style}
    >
      <div className="relative h-full w-full [transform-style:preserve-3d]" style={flipStyle}>
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <CardBack />
        </div>
        <div
          className={`absolute inset-0 overflow-hidden rounded-[6px] border-2 border-ember-500 bg-charcoal-900 [backface-visibility:hidden] [transform:rotateY(180deg)] ${revealed ? '' : 'invisible'}`}
        >
          <div className="relative flex h-full w-full items-center justify-center bg-charcoal-900">
            {pamato && (
              <div className={result === 'CHUB' ? 'h-full w-full [filter:sepia(1)_saturate(3)_hue-rotate(320deg)_brightness(0.9)]' : 'h-full w-full'}>
                <CardImage image={pamato} hideLabel />
              </div>
            )}
          </div>
        </div>
      </div>
      {isWinner && winnerName && winnerAmount !== undefined && (
        <div className="absolute left-1/2 top-full mt-0.5 max-w-[80px] -translate-x-1/2 text-center">
          <p className="truncate text-[8px] font-bold leading-tight text-amber-300 drop-shadow-md sm:text-[9px]">{winnerName}</p>
          <p className="whitespace-nowrap text-[7px] font-bold leading-tight text-white drop-shadow-md sm:text-[8px]">Nanalo ng {winnerAmount} teks</p>
        </div>
      )}
    </div>
  );
}
