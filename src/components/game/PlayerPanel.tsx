import type { Player, PlayerStatus } from '@/game/types';
import type { ResolvedImage } from '@/media/useMediaSettings';
import { CardImage } from '@/components/CardImage';

const STATUS_LABEL: Record<PlayerStatus, string> = {
  naghihintay: 'Naghihintay',
  nakataya: 'Nakataya',
  nanalo: 'Nanalo',
  natalo: 'Natalo',
  tabla: 'Tabla',
  bago: 'Bagong manlalaro',
};

interface PlayerPanelProps {
  player: Player;
  isMano: boolean;
  onChoosePamato?: () => void;
  pamato?: ResolvedImage | null;
}

export function PlayerPanel({ player, isMano, onChoosePamato, pamato }: PlayerPanelProps) {
  return (
    <div
      className={`grid min-w-0 grid-cols-[34px_minmax(0,1fr)_auto_auto] items-center gap-1 rounded-lg border px-1 py-1 text-sm transition-colors duration-300 sm:grid-cols-[42px_minmax(0,1fr)_auto_auto] sm:gap-2 sm:px-2 sm:py-1.5 ${
        isMano ? 'border-ember-500 bg-charcoal-800' : 'border-charcoal-700 bg-charcoal-900'
      }`}
    >
      <button
        type="button"
        onClick={onChoosePamato}
        disabled={!onChoosePamato}
        aria-label={pamato ? `Palitan ang pamato ni ${player.name}` : undefined}
        className="h-8 w-full overflow-hidden rounded border border-charcoal-600 bg-charcoal-950 disabled:cursor-default sm:h-10"
      >
        {pamato && <CardImage image={pamato} hideLabel />}
      </button>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-charcoal-50">{player.name}</p>
        <p className="truncate text-sm leading-tight text-charcoal-400">
          {isMano ? 'MANO · ' : ''}{player.isHuman ? 'You' : 'CPU'} · {STATUS_LABEL[player.status]}
        </p>
      </div>
      <div className="min-w-[38px] text-right">
        <p className="text-xs uppercase text-charcoal-400">Bal.</p>
        <p className="font-display text-sm tabular-nums text-ember-300 sm:text-base">{player.balance}</p>
      </div>
      <div className="min-w-[34px] text-right">
        <p className="text-xs uppercase text-charcoal-400">Taya</p>
        <p className="font-display text-sm tabular-nums text-charcoal-50 sm:text-base">{player.wager}</p>
      </div>
    </div>
  );
}
