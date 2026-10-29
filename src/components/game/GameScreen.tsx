import { Flame } from 'lucide-react';
import { useState } from 'react';
import { useTeksGame } from '@/game/useTeksGame';
import { ControlBar } from './ControlBar';
import { PlayerPanel } from './PlayerPanel';
import { PlayingArena } from './PlayingArena';
import { RoundBanner } from './RoundBanner';
import { PamatoPicker } from './PamatoPicker';
import type { GameConfig } from '@/game/types';
import { useMediaSettings } from '@/media/useMediaSettings';

interface GameScreenProps {
  config: GameConfig;
}

export function GameScreen({ config }: GameScreenProps) {
  const { state, hagis, setWager, togglePause, restart } = useTeksGame(config);
  const media = useMediaSettings();
  const [pamatoConfirmed, setPamatoConfirmed] = useState(false);
  const [activePamatoPlayer, setActivePamatoPlayer] = useState<number | null>(0);
  const [playerPamatoIds, setPlayerPamatoIds] = useState<string[]>(() => [
    media.chaId,
    media.catalogImages[1]?.key ?? media.chaId,
    media.catalogImages[2]?.key ?? media.chaId,
  ].slice(0, config.mode === 'solo' ? 1 : 3));
  const playerPamatos = state.players.map((_, index) => {
    const id = playerPamatoIds[index] ?? media.chaId;
    return [...media.catalogImages, ...media.customImages].find((image) => image.key === id) ?? media.chaImage;
  });
  const gameplayBlocked = !pamatoConfirmed;

  function confirmPamatoSelection(id: string) {
    if (activePamatoPlayer === null) return;
    setPlayerPamatoIds((current) => current.map((value, index) => index === activePamatoPlayer ? id : value));
    const shouldChooseAnotherPlayer = config.mode === 'multiplayer'
      && !pamatoConfirmed
      && activePamatoPlayer < state.players.length - 1;
    if (shouldChooseAnotherPlayer) {
      setActivePamatoPlayer((current) => current === null ? null : current + 1);
    } else {
      setPamatoConfirmed(true);
      setActivePamatoPlayer(null);
    }
  }

  function openPamatoPicker(playerIndex: number) {
    setActivePamatoPlayer(playerIndex);
  }
  const guardedHagis = gameplayBlocked ? () => undefined : hagis;

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-charcoal-950 text-charcoal-100">
      <header className="border-b border-charcoal-800 bg-charcoal-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-2 py-1 lg:px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-ember-400 to-red-600 text-charcoal-950 shadow-lg">
            <Flame className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display leading-none text-charcoal-50">
              <span className="block text-2xl tracking-wider sm:text-3xl">Pinoy Text</span>
              <span className="block text-base text-ember-400 sm:text-lg">Tara, Laban Tayo!</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-y-auto p-1 sm:p-2 lg:overflow-hidden">
        <section className="game-layout flex min-w-0 flex-1 flex-col">
          <aside className="desktop-left-panel flex min-w-0 flex-col">
            <div className="desktop-pamato-section min-w-0">
              <PamatoPicker media={media} onSelect={media.selectCha} />
            </div>

            <div className="desktop-controls-section flex min-h-0 flex-col gap-2">
              <div className="desktop-player-list hidden flex-col gap-2 lg:flex">
                {state.players.map((player, index) => (
                  <PlayerPanel key={player.id} player={player} isMano={player.id === state.manoId} pamato={playerPamatos[index]} onChoosePamato={config.mode === 'multiplayer' ? () => openPamatoPicker(index) : undefined} />
                ))}
              </div>

              <div className="mobile-control-bar">
                <ControlBar
                  state={state}
                  onHagis={guardedHagis}
                  onSetWager={setWager}
                  onTogglePause={togglePause}
                  gameplayBlocked={gameplayBlocked}
                />
              </div>

              <RoundBanner
                banner={state.banner}
                gameOver={state.phase === 'gameover'}
                paused={state.paused}
                onRestart={restart}
              />
            </div>
          </aside>

          <div className="mobile-player-list grid min-w-0 grid-cols-3 gap-1 lg:hidden">
            {state.players.map((player, index) => (
              <PlayerPanel key={player.id} player={player} isMano={player.id === state.manoId} pamato={playerPamatos[index]} onChoosePamato={config.mode === 'multiplayer' ? () => openPamatoPicker(index) : undefined} />
            ))}
          </div>

          <div className="desktop-board flex min-w-0 flex-col">
            <PlayingArena
              players={state.players}
              plan={state.plan}
              phase={state.phase}
              elapsed={state.elapsed}
              paused={state.paused}
              winnerResult={state.winnerResult}
              isTie={state.banner?.tone === 'tie'}
              pamato={media.chaImage}
              playerPamatos={playerPamatos}
            />

          </div>
        </section>
      </main>

      {activePamatoPlayer !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/80 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="pamato-modal-title">
          <div className="choose-pamato-modal w-full max-w-3xl p-3 sm:p-4">
            <h2 id="pamato-modal-title" className="mb-3 font-display text-2xl tracking-wide text-charcoal-50">
              Choose Pamato — Player {activePamatoPlayer + 1}
            </h2>
            <PamatoPicker
              media={media}
              selectedId={playerPamatoIds[activePamatoPlayer]}
              onSelect={confirmPamatoSelection}
              onSelectConfirm={() => undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}
