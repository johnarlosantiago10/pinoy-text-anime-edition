import { Flame } from 'lucide-react';
import { useTeksGame } from '@/game/useTeksGame';
import { useMediaSettings } from '@/media/useMediaSettings';
import { ControlBar } from './ControlBar';
import { PlayerPanel } from './PlayerPanel';
import { PlayingArena } from './PlayingArena';
import { RoundBanner } from './RoundBanner';
import { MediaPanel } from '@/components/media/MediaPanel';

interface GameScreenProps {
  playerName: string;
}

export function GameScreen({ playerName }: GameScreenProps) {
  const { state, hagis, setWager, togglePause, restart } = useTeksGame(playerName);
  const media = useMediaSettings();

  return (
    <div className="min-h-screen bg-charcoal-950 text-charcoal-100">
      <header className="border-b border-charcoal-800 bg-charcoal-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 lg:px-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-ember-400 to-red-600 text-charcoal-950 shadow-lg">
            <Flame className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl leading-none tracking-wider text-charcoal-50 sm:text-3xl">
              Pinoy Text: <span className="text-ember-400">Anime Edition</span>
            </h1>
            <p className="text-xs text-charcoal-400">Virtual teks lamang. Walang tunay na pera.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-8">
        <section className="flex min-w-0 flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {state.players.map((player) => (
              <PlayerPanel key={player.id} player={player} isMano={player.id === state.manoId} />
            ))}
          </div>

          <PlayingArena
            players={state.players}
            manoId={state.manoId}
            plan={state.plan}
            phase={state.phase}
            elapsed={state.elapsed}
            paused={state.paused}
            chaImage={media.chaImage}
            chubTiles={media.chubTiles}
            onImageError={media.markBroken}
          />

          <RoundBanner
            banner={state.banner}
            gameOver={state.phase === 'gameover'}
            paused={state.paused}
            onRestart={restart}
          />

          <ControlBar
            state={state}
            onHagis={hagis}
            onSetWager={setWager}
            onTogglePause={togglePause}
          />
        </section>

        <aside>
          <MediaPanel media={media} />
        </aside>
      </main>
    </div>
  );
}
