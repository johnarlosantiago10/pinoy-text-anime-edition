import { RotateCcw, TriangleAlert } from 'lucide-react';
import type { Banner } from '@/game/types';

interface RoundBannerProps {
  banner: Banner | null;
  gameOver: boolean;
  paused: boolean;
  onRestart: () => void;
}

export function RoundBanner({ banner, gameOver, paused, onRestart }: RoundBannerProps) {
  if (gameOver && banner) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-red-500/60 bg-red-950/40 p-5 text-center">
        <TriangleAlert className="h-7 w-7 text-red-300" />
        <p className="font-display text-2xl tracking-wide text-red-100">{banner.headline}</p>
        {banner.lines.map((line) => (
          <p key={line} className="text-base text-red-100/90">
            {line}
          </p>
        ))}
        <button
          type="button"
          onClick={onRestart}
          className="mt-1 flex items-center gap-2 rounded-lg bg-ember-500 px-5 py-2.5 text-base font-bold text-charcoal-950 transition-colors hover:bg-ember-400"
        >
          <RotateCcw className="h-4 w-4" />
          Magsimula muli
        </button>
      </div>
    );
  }

  if (paused) {
    return (
      <div className="flex min-h-[72px] items-center justify-center rounded-xl border border-charcoal-700 bg-charcoal-900 p-4 text-base font-semibold text-ember-300">
        Naka-pause ang laro. Pindutin ang RESUME para magpatuloy.
      </div>
    );
  }

  if (!banner) {
    return null;
  }

  if (banner.tone === 'win' || banner.tone === 'tie') {
    return null;
  }

  const toneStyle = 'border-amber-500/60 bg-amber-950/40';
  const Icon = TriangleAlert;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex min-h-[72px] items-center gap-4 rounded-xl border p-4 ${toneStyle}`}
    >
      <Icon className="h-7 w-7 shrink-0 text-ember-300" />
      <div className="min-w-0">
        <p className="font-display text-xl tracking-wide text-charcoal-50 sm:text-2xl">{banner.headline}</p>
        {banner.lines.map((line) => (
          <p key={line} className="text-base text-charcoal-200">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
