import type { CSSProperties } from 'react';
import { THROW_MS } from '@/game/constants';
import { throwPose } from '@/game/throwPose';
import type { Phase, Player, ThrowPlan } from '@/game/types';
import type { ResolvedImage } from '@/media/useMediaSettings';
import { PamatoCard } from './PamatoCard';

const START_POINTS = [
  { x: 30, y: 86 },
  { x: 50, y: 90 },
  { x: 70, y: 86 },
];

const ARENA_STYLE = {
  '--card-w': 'clamp(68px, 13vw, 124px)',
  '--card-h': 'calc(var(--card-w) * 1.4)',
} as CSSProperties;

interface PlayingArenaProps {
  players: Player[];
  manoId: string;
  plan: ThrowPlan | null;
  phase: Phase;
  elapsed: number;
  paused: boolean;
  chaImage: ResolvedImage | null;
  chubTiles: ResolvedImage[];
  onImageError: (src: string) => void;
}

function hintFor(phase: Phase, mano: Player | undefined, paused: boolean): string | null {
  if (paused) return null;
  if (phase === 'waiting') return 'Ikaw ang MANO. Pindutin ang HAGIS para magtapon.';
  if (phase === 'cpu-turn') return `${mano?.name ?? 'Computer'} ang MANO. Naghahagis...`;
  return null;
}

export function PlayingArena({
  players,
  manoId,
  plan,
  phase,
  elapsed,
  paused,
  chaImage,
  chubTiles,
  onImageError,
}: PlayingArenaProps) {
  const showCards = plan !== null && (phase === 'throwing' || phase === 'revealed');
  const progress = phase === 'revealed' ? 1 : Math.min(elapsed / THROW_MS, 1);
  const hint = hintFor(phase, players.find((player) => player.id === manoId), paused);

  return (
    <div
      className="dirt-arena relative w-full overflow-hidden rounded-2xl border border-charcoal-700 shadow-[inset_0_0_60px_rgba(0,0,0,0.55)] [perspective:900px]"
      style={ARENA_STYLE}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember-500/60 to-transparent" />
      {showCards && plan
        ? players.map((player, index) => {
            const landing = plan.landings[player.id];
            if (!landing) return null;
            const pose = throwPose(progress, START_POINTS[index] ?? START_POINTS[0], landing);
            return (
              <div key={player.id} className="contents">
                <PamatoCard
                  x={pose.x}
                  y={pose.y}
                  lift={pose.lift}
                  spin={pose.spin}
                  tilt={pose.tilt}
                  result={plan.results[player.id]}
                  revealed={phase === 'revealed'}
                  chaImage={chaImage}
                  chubTiles={chubTiles}
                  onImageError={onImageError}
                />
                {phase === 'revealed' && (
                  <span
                    className="absolute -translate-x-1/2 rounded-full bg-charcoal-950/85 px-2.5 py-0.5 text-xs font-semibold text-ember-200"
                    style={{ left: `${landing.x}%`, top: `calc(${landing.y}% + var(--card-h) * 0.5 + 10px)` }}
                  >
                    {player.name}
                  </span>
                )}
              </div>
            );
          })
        : null}

      {hint && (
        <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-4">
          <span className="rounded-full bg-charcoal-950/80 px-4 py-2 text-center text-sm font-medium text-charcoal-100 shadow-lg">
            {hint}
          </span>
        </div>
      )}

      {paused && (
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal-950/70 backdrop-blur-[2px]">
          <span className="font-display text-4xl tracking-[0.3em] text-ember-400">PAUSED</span>
        </div>
      )}
    </div>
  );
}
