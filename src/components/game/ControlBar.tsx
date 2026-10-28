import { Flame, Pause, Play } from 'lucide-react';
import { WAGER_CHIPS, MIN_WAGER } from '@/game/constants';
import type { GameState } from '@/game/types';

interface ControlBarProps {
  state: GameState;
  onHagis: () => void;
  onSetWager: (amount: number) => void;
  onTogglePause: () => void;
  gameplayBlocked?: boolean;
}

export function ControlBar({ state, onHagis, onSetWager, onTogglePause, gameplayBlocked = false }: ControlBarProps) {
  const human = state.players.find((player) => player.id === state.humanId);
  if (!human) return null;

  const wagerLocked = gameplayBlocked || state.paused || state.phase === 'throwing' || state.phase === 'gameover';
  const canThrow = !gameplayBlocked && state.phase === 'waiting' && !state.paused;
  const chipOptions: { value: number; label: string }[] = WAGER_CHIPS.filter((value) => value <= human.balance).map((value) => ({
    value,
    label: String(value),
  }));
  if (human.balance >= MIN_WAGER && !chipOptions.some((chip) => chip.value === human.balance)) {
    chipOptions.push({ value: human.balance, label: `Lahat (${human.balance})` });
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-charcoal-700 bg-charcoal-900 p-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold uppercase tracking-wide text-charcoal-400">Taya</span>
        {chipOptions.map((chip) => {
          const selected = human.wager === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              disabled={wagerLocked}
              onClick={() => onSetWager(chip.value)}
              aria-pressed={selected}
              className={`rounded-md border px-2 py-1 text-sm font-semibold tabular-nums transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                selected
                  ? 'border-ember-400 bg-ember-500 text-charcoal-950'
                  : 'border-charcoal-600 bg-charcoal-800 text-charcoal-100 hover:border-ember-500/70'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_auto] items-stretch gap-3">
        <button
          type="button"
          onClick={onHagis}
          disabled={!canThrow}
          className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-b from-red-500 to-red-700 py-2.5 font-display text-3xl tracking-[0.2em] text-white shadow-[0_8px_0_#7f1d1d,0_12px_24px_rgba(0,0,0,0.5)] transition-all duration-150 hover:brightness-110 active:translate-y-1 active:shadow-[0_4px_0_#7f1d1d] disabled:cursor-not-allowed disabled:bg-none disabled:bg-charcoal-700 disabled:text-charcoal-400 disabled:shadow-none sm:text-4xl"
        >
          <Flame className="h-7 w-7 transition-transform group-hover:scale-110" />
          HAGIS
        </button>
        <button
          type="button"
          onClick={onTogglePause}
          disabled={state.phase === 'gameover'}
          className="flex w-32 flex-col items-center justify-center gap-1 rounded-xl border border-ember-500/60 bg-charcoal-800 text-base font-semibold text-ember-300 transition-colors hover:bg-charcoal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state.paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          {state.paused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>
    </div>
  );
}
