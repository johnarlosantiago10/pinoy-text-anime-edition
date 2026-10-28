import { Crown, User } from 'lucide-react';
import type { Player, PlayerStatus } from '@/game/types';

const STATUS_LABEL: Record<PlayerStatus, string> = {
  naghihintay: 'Naghihintay',
  nakataya: 'Nakataya',
  nanalo: 'Nanalo',
  natalo: 'Natalo',
  tabla: 'Tabla',
  bago: 'Bagong manlalaro',
};

const STATUS_STYLE: Record<PlayerStatus, string> = {
  naghihintay: 'bg-charcoal-700 text-charcoal-100',
  nakataya: 'bg-ember-500/20 text-ember-300',
  nanalo: 'bg-emerald-500/20 text-emerald-300',
  natalo: 'bg-red-500/20 text-red-300',
  tabla: 'bg-charcoal-600 text-charcoal-100',
  bago: 'bg-amber-500/20 text-amber-200',
};

interface PlayerPanelProps {
  player: Player;
  isMano: boolean;
}

export function PlayerPanel({ player, isMano }: PlayerPanelProps) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-3 rounded-xl border p-3 transition-colors duration-300 sm:p-4 ${
        isMano ? 'border-ember-500 bg-charcoal-800' : 'border-charcoal-700 bg-charcoal-900'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal-700 text-charcoal-100">
            <User className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-charcoal-50">{player.name}</p>
            <p className="text-xs text-charcoal-400">{player.isHuman ? 'Ikaw' : 'Computer'}</p>
          </div>
        </div>
        {isMano && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-ember-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-charcoal-950">
            <Crown className="h-3 w-3" />
            MANO
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-charcoal-950/60 p-2">
          <p className="text-[11px] uppercase tracking-wide text-charcoal-400">Balance</p>
          <p className="font-display text-xl tabular-nums text-ember-300">{player.balance}</p>
        </div>
        <div className="rounded-lg bg-charcoal-950/60 p-2">
          <p className="text-[11px] uppercase tracking-wide text-charcoal-400">Taya</p>
          <p className="font-display text-xl tabular-nums text-charcoal-50">{player.wager}</p>
        </div>
      </div>

      <span
        className={`self-start rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[player.status]}`}
      >
        {STATUS_LABEL[player.status]}
      </span>
    </div>
  );
}
