export type GameMode = 'solo' | 'multiplayer';

export interface GameConfig {
  mode: GameMode;
  players: string[];
}

export type Side = 'CHA' | 'CHUB';

export type Phase = 'waiting' | 'cpu-turn' | 'throwing' | 'revealed' | 'gameover';

export type PlayerStatus = 'naghihintay' | 'nakataya' | 'nanalo' | 'natalo' | 'tabla' | 'bago';

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  balance: number;
  wager: number;
  status: PlayerStatus;
}

export interface Landing {
  x: number;
  y: number;
  rot: number;
}

export interface ThrowPlan {
  results: Record<string, Side>;
  landings: Record<string, Landing>;
}

export interface Banner {
  tone: 'win' | 'tie' | 'alert';
  headline: string;
  lines: string[];
}

export interface GameState {
  players: Player[];
  humanId: string;
  manoId: string;
  phase: Phase;
  elapsed: number;
  paused: boolean;
  round: number;
  bets: Record<string, number>;
  plan: ThrowPlan | null;
  winnerResult: { playerId: string; name: string; amount: number } | null;
  banner: Banner | null;
}

export type GameAction =
  | { type: 'TICK'; dt: number }
  | { type: 'HAGIS' }
  | { type: 'SET_WAGER'; amount: number }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESTART' };
