import { Bot, Flame, Play, Users } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { GameConfig, GameMode } from '@/game/types';

interface SetupScreenProps {
  onStart: (config: GameConfig) => void;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [mode, setMode] = useState<GameMode>('solo');
  const [players, setPlayers] = useState(['You', 'Player 2', 'Player 3']);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const names = players.map((name, index) => name.trim().slice(0, 16) || (index === 0 ? 'You' : `Player ${index + 1}`));
    onStart({ mode, players: mode === 'solo' ? [names[0]] : names });
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-charcoal-950 p-2 sm:p-4">
      <div className="w-full max-w-md rounded-xl border border-charcoal-700 bg-charcoal-900 p-4 text-center shadow-2xl sm:p-6">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-ember-400 to-red-600 text-charcoal-950">
          <Flame className="h-8 w-8" />
        </span>
        <h1 className="mt-4 font-display text-4xl tracking-wider text-charcoal-50">
          Pinoy Text
          <span className="mt-1 block text-xl text-ember-400">Tara, Laban Tayo!</span>
        </h1>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 text-left">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMode('solo')} className={`flex min-h-16 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${mode === 'solo' ? 'border-ember-400 bg-ember-500 text-charcoal-950' : 'border-charcoal-600 bg-charcoal-800 text-charcoal-100'}`}>
              <Bot className="h-5 w-5" /> Solo vs Computer
            </button>
            <button type="button" onClick={() => setMode('multiplayer')} className={`flex min-h-16 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${mode === 'multiplayer' ? 'border-ember-400 bg-ember-500 text-charcoal-950' : 'border-charcoal-600 bg-charcoal-800 text-charcoal-100'}`}>
              <Users className="h-5 w-5" /> Multiplayer
            </button>
          </div>
          {mode === 'solo' ? (
            <label className="flex flex-col gap-1 text-xs font-semibold text-charcoal-200">
              Player
              <input value={players[0]} onChange={(event) => setPlayers([event.target.value, players[1], players[2]])} maxLength={16} placeholder="Alyas" className="rounded-lg border border-charcoal-600 bg-charcoal-950 px-3 py-2 text-charcoal-50 outline-none placeholder:text-charcoal-500 focus:border-ember-500" />
            </label>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {players.map((player, index) => (
                <label key={index} className="min-w-0 text-[10px] font-semibold text-charcoal-300">
                  Player {index + 1}
                  <input value={player} onChange={(event) => setPlayers((current) => current.map((name, playerIndex) => playerIndex === index ? event.target.value : name))} maxLength={16} placeholder="Alyas" className="mt-1 w-full rounded border border-charcoal-600 bg-charcoal-950 px-2 py-2 text-xs text-charcoal-50 outline-none placeholder:text-charcoal-500 focus:border-ember-500" />
                </label>
              ))}
            </div>
          )}
          <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-ember-500 py-3 font-display text-xl tracking-widest text-charcoal-950 transition-all hover:bg-ember-400 active:scale-[0.98]">
            <Play className="h-5 w-5" /> Laban Na
          </button>
        </form>
      </div>
    </div>
  );
}
