import type { CSSProperties } from 'react';
import { THROW_MS, WINNER_REVEAL_DELAY_MS } from '@/game/constants';
import { throwPose } from '@/game/throwPose';
import type { Phase, Player, ThrowPlan } from '@/game/types';
import { PamatoCard } from './PamatoCard';
import type { ResolvedImage } from '@/media/useMediaSettings';
import { CHA_IMAGES, CHUB_IMAGE } from '@/media/catalog';

const START_POINTS = [
  { x: 30, y: 86 },
  { x: 50, y: 90 },
  { x: 70, y: 86 },
];

const ARENA_STYLE = {
  '--card-w': 'clamp(82px, 27vw, 193px)',
  '--card-h': 'calc(var(--card-w) * 1.4)',
} as CSSProperties;

interface PlayingArenaProps {
  players: Player[];
  plan: ThrowPlan | null;
  phase: Phase;
  elapsed: number;
  paused: boolean;
  winnerResult: { playerId: string; name: string; amount: number } | null;
  isTie?: boolean;
  pamato: ResolvedImage | null;
  playerPamatos?: (ResolvedImage | null)[];
}

export function PlayingArena({
  players,
  plan,
  phase,
  elapsed,
  paused,
  winnerResult,
  isTie = false,
  pamato,
  playerPamatos,
}: PlayingArenaProps) {
  const hasFinishedRound = plan !== null && (phase === 'revealed' || phase === 'waiting' || phase === 'cpu-turn');
  const showCards = plan !== null && (phase === 'throwing' || hasFinishedRound);
  const progress = phase === 'revealed' || hasFinishedRound ? 1 : Math.min(elapsed / THROW_MS, 1);
  const winnerId = winnerResult?.playerId ?? null;
  const winnerActive = winnerId !== null && hasFinishedRound && elapsed >= WINNER_REVEAL_DELAY_MS;
  const toResolved = (image: typeof CHA_IMAGES[number]): ResolvedImage => ({
    key: image.id,
    src: image.src,
    fallbackSrc: image.fallbackSrc,
    position: image.position,
    label: image.label,
  });
  const chubImage = toResolved(CHUB_IMAGE);
  const selectedChaIndex = pamato?.key.startsWith('cha-')
    ? CHA_IMAGES.findIndex((image) => image.id === pamato.key)
    : 0;
  const selectedCustomPamato = pamato?.key.startsWith('up-') ? pamato : null;

  return (
    <div
      className="dirt-arena relative w-full overflow-hidden rounded-xl border border-charcoal-700 shadow-[inset_0_0_60px_rgba(0,0,0,0.55)] [perspective:900px]"
      style={ARENA_STYLE}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember-500/60 to-transparent" />
      {!plan && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 grid grid-cols-3 gap-2" aria-label="Player balances">
          {players.map((player) => (
            <div key={player.id} className="rounded-md border border-charcoal-700/80 bg-charcoal-950/75 px-2 py-1 text-center shadow-md">
              <p className="truncate text-sm font-bold text-charcoal-50">{player.name}</p>
              <p className="font-display text-base tabular-nums text-ember-300">{player.balance} teks</p>
            </div>
          ))}
        </div>
      )}
      {showCards && plan
        ? players.map((player, index) => {
            if (winnerActive && player.id !== winnerId) return null;
            const landing = plan.landings[player.id];
            if (!landing) return null;
            const pose = winnerActive
              ? { x: 50, y: 48, lift: 0, spin: 0, tilt: 0 }
              : throwPose(progress, START_POINTS[index] ?? START_POINTS[0], landing);
            return (
              <div key={player.id} className="contents">
                <PamatoCard
                  x={pose.x}
                  y={pose.y}
                  lift={pose.lift}
                  spin={pose.spin}
                  tilt={pose.tilt}
                  result={plan.results[player.id]}
                  revealed={phase === 'revealed' || hasFinishedRound}
                  isWinner={winnerActive && player.id === winnerId}
                  winnerName={winnerResult?.name}
                  winnerAmount={winnerResult?.amount}
                  pamato={plan.results[player.id] === 'CHA'
                    ? playerPamatos?.[index] ?? selectedCustomPamato ?? toResolved(CHA_IMAGES[(Math.max(selectedChaIndex, 0) + index) % CHA_IMAGES.length])
                    : chubImage}
                />
                {!winnerActive && (phase === 'revealed' || hasFinishedRound) && (
                  <span
                    className={`absolute -translate-x-1/2 rounded-full px-2.5 py-0.5 text-center text-sm font-semibold ${player.id === winnerId ? 'bg-emerald-500 text-charcoal-950' : 'bg-charcoal-950/85 text-ember-200'}`}
                    style={{ left: `${landing.x}%`, top: `calc(${landing.y}% + var(--card-h) * 0.5 + 10px)` }}
                  >
                    {player.name}
                  </span>
                )}
              </div>
            );
          })
        : null}

      {isTie && hasFinishedRound && !winnerActive && (
        <div className="pointer-events-none absolute inset-x-2 top-2 z-30 flex justify-center" role="status" aria-live="polite">
          <span className="rounded-lg border border-ember-300 bg-charcoal-950/95 px-4 py-2 text-center font-display text-xl tracking-wider text-ember-300 shadow-xl sm:text-2xl">
            CHUB CHA TABLA
          </span>
        </div>
      )}

      {winnerActive && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {[20, 35, 65, 80].map((left, index) => (
            <span
              key={left}
              className="absolute top-[38%] h-2 w-1 animate-pulse rounded-full bg-amber-300"
              style={{ left: `${left}%`, transform: `rotate(${index * 25}deg)` }}
            />
          ))}
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
