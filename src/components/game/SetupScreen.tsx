import { Flame, Play } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface SetupScreenProps {
  onStart: (name: string) => void;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [name, setName] = useState('Ikaw');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onStart(name.trim().slice(0, 16) || 'Ikaw');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-charcoal-700 bg-charcoal-900 p-8 text-center shadow-2xl">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-ember-400 to-red-600 text-charcoal-950">
          <Flame className="h-8 w-8" />
        </span>
        <h1 className="mt-5 font-display text-4xl tracking-wider text-charcoal-50">
          Pinoy Text: <span className="text-ember-400">Anime Edition</span>
        </h1>
        <p className="mt-3 text-sm text-charcoal-300">
          Solo laban sa dalawang computer. Magsisimula ka na may 100 virtual teks.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 text-left">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-charcoal-200">
            Pangalan mo
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={16}
              className="rounded-lg border border-charcoal-600 bg-charcoal-950 px-4 py-3 text-charcoal-50 outline-none transition-colors focus:border-ember-500"
            />
          </label>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-ember-500 py-3.5 font-display text-2xl tracking-widest text-charcoal-950 transition-all hover:bg-ember-400 active:scale-[0.98]"
          >
            <Play className="h-5 w-5" />
            SIMULAN
          </button>
        </form>
      </div>
    </div>
  );
}
