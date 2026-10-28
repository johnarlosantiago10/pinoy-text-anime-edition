import { useEffect, useReducer } from 'react';
import { gameReducer, createInitialState } from './gameReducer';
import type { GameConfig, GameState } from './types';

export function useTeksGame(config: GameConfig) {
  const [state, dispatch] = useReducer(gameReducer, config, createInitialState);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      dispatch({ type: 'TICK', dt });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  return {
    state: state as GameState,
    hagis: () => dispatch({ type: 'HAGIS' }),
    setWager: (amount: number) => dispatch({ type: 'SET_WAGER', amount }),
    togglePause: () => dispatch({ type: 'TOGGLE_PAUSE' }),
    restart: () => dispatch({ type: 'RESTART' }),
  };
}
