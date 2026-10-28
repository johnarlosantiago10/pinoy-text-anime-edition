import {
  CPU_TURN_DELAY_MS,
  MIN_WAGER,
  REVEAL_HOLD_MS,
  START_BALANCE,
  THROW_MS,
} from './constants';
import {
  clampHumanWager,
  decideWinner,
  pickCpuName,
  pickCpuWager,
  planLandings,
  randomSide,
} from './rules';
import type { Banner, GameAction, GameConfig, GameState, Phase, Player, Side } from './types';

const CPU_IDS = ['p1', 'p2'];

function makeInitialPlayers(config: GameConfig): Player[] {
  if (config.mode === 'multiplayer') {
    return config.players.map((name, index) => ({
      id: `p${index}`,
      name,
      isHuman: true,
      balance: START_BALANCE,
      wager: MIN_WAGER,
      status: 'naghihintay' as const,
    }));
  }

  const human: Player = {
    id: 'p0',
    name: config.players[0] ?? 'You',
    isHuman: true,
    balance: START_BALANCE,
    wager: MIN_WAGER,
    status: 'naghihintay',
  };
  const cpus = CPU_IDS.map((id, index) => ({
    id,
    name: ['Kaito', 'Yuki'][index],
    isHuman: false,
    balance: START_BALANCE,
    wager: 0,
    status: 'naghihintay' as const,
  }));
  return [human, ...cpus];
}

function phaseDuration(phase: Phase): number {
  if (phase === 'cpu-turn') return CPU_TURN_DELAY_MS;
  if (phase === 'throwing') return THROW_MS;
  if (phase === 'revealed') return REVEAL_HOLD_MS;
  return Infinity;
}

function prepareRound(state: GameState): GameState {
  const players = state.players.map((player) => {
    if (player.isHuman) {
      return {
        ...player,
        wager: clampHumanWager(player.wager, player.balance),
        status: 'naghihintay' as const,
      };
    }
    return { ...player, wager: pickCpuWager(player.balance), status: 'naghihintay' as const };
  });
  const allPlayersAreHuman = state.players.every((player) => player.isHuman);
  const phase: Phase = allPlayersAreHuman || state.manoId === state.humanId ? 'waiting' : 'cpu-turn';
  return {
    ...state,
    players,
    phase,
    elapsed: 0,
    bets: {},
  };
}

export function createInitialState(config: GameConfig): GameState {
  const base: GameState = {
    players: makeInitialPlayers(config),
    humanId: 'p0',
    manoId: 'p0',
    phase: 'waiting',
    elapsed: 0,
    paused: false,
    round: 0,
    bets: {},
    plan: null,
    winnerResult: null,
    banner: null,
  };
  return prepareRound(base);
}

function startThrow(state: GameState): GameState {
  const bets: Record<string, number> = {};
  const players = state.players.map((player) => {
    const amount = Math.min(player.wager, player.balance);
    bets[player.id] = amount;
    return { ...player, balance: player.balance - amount, status: 'nakataya' as const };
  });

  const results: Record<string, Side> = {};
  players.forEach((player) => {
    results[player.id] = randomSide();
  });

  return {
    ...state,
    players,
    bets,
    plan: { results, landings: planLandings(players.map((player) => player.id)) },
    phase: 'throwing',
    elapsed: 0,
    round: state.round + 1,
    winnerResult: null,
    banner: null,
  };
}

function settleRound(state: GameState): GameState {
  if (!state.plan) return state;

  const { results } = state.plan;
  const winnerId = decideWinner(results);
  const pot = Object.values(state.bets).reduce((sum, amount) => sum + amount, 0);
  const lines: string[] = [];
  let banner: Banner;
  let manoId = state.manoId;
  let winnerResult: GameState['winnerResult'] = null;

  const players = state.players.map((player) => {
    if (winnerId === null) {
      return {
        ...player,
        balance: player.balance + (state.bets[player.id] ?? 0),
        status: 'tabla' as const,
      };
    }
    if (player.id === winnerId) {
      return { ...player, balance: player.balance + pot, status: 'nanalo' as const };
    }
    return { ...player, status: 'natalo' as const };
  });

  if (winnerId === null) {
    banner = {
      tone: 'tie',
      headline: 'CHUB CHA TABLA',
      lines: [],
    };
  } else {
    const winner = players.find((player) => player.id === winnerId);
    const net = pot - (state.bets[winnerId] ?? 0);
    winnerResult = { playerId: winnerId, name: winner?.name ?? '', amount: net };
    manoId = winnerId;
    if (winner?.isHuman) {
      banner = { tone: 'win', headline: `Nanalo si ${winner?.name ?? ''} ng ${net} teks!`, lines: [] };
    } else {
      banner = {
        tone: 'win',
        headline: `Nanalo si ${winner?.name ?? ''} ng ${net} teks!`,
        lines: [`${winner?.name ?? ''} na ang MANO.`],
      };
    }
  }

  const settled = players.map((player) => {
    if (player.isHuman || player.balance >= MIN_WAGER) return player;
    const name = pickCpuName(players);
    lines.push(`${player.name} naubos ang teks. Pinalitan ng ${name} na may 100 teks.`);
    return { ...player, name, balance: START_BALANCE, wager: 0, status: 'bago' as const };
  });

  return {
    ...state,
    players: settled,
    manoId,
    phase: 'revealed',
    elapsed: 0,
    bets: {},
    winnerResult,
    banner: { ...banner, lines: [...banner.lines, ...lines] },
  };
}

function afterReveal(state: GameState): GameState {
  const human = state.players.find((player) => player.isHuman);
  if (!human || human.balance < MIN_WAGER) {
    return {
      ...state,
      phase: 'gameover',
      elapsed: 0,
      banner: {
        tone: 'alert',
        headline: 'Naubos ang iyong teks.',
        lines: ['Hindi ka na makapaglaro. Magsimula muli para makabalik sa 100 teks.'],
      },
    };
  }
  return prepareRound(state);
}

function advanceClock(state: GameState, dt: number): GameState {
  if (state.paused || state.phase === 'waiting' || state.phase === 'gameover') return state;

  const elapsed = state.elapsed + dt;
  if (elapsed < phaseDuration(state.phase)) return { ...state, elapsed };

  if (state.phase === 'cpu-turn') return startThrow(state);
  if (state.phase === 'throwing') return settleRound(state);
  return afterReveal(state);
}

function setHumanWager(state: GameState, amount: number): GameState {
  if (state.paused || state.phase === 'throwing' || state.phase === 'gameover') return state;
  const humanIndex = state.players.findIndex((player) => player.id === state.humanId);
  const human = state.players[humanIndex];
  const players = state.players.map((player, index) =>
    index === humanIndex ? { ...player, wager: clampHumanWager(amount, human.balance) } : player,
  );
  return { ...state, players };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK':
      return advanceClock(state, action.dt);
    case 'HAGIS':
      if (state.paused || state.phase !== 'waiting') return state;
      return startThrow(state);
    case 'SET_WAGER':
      return setHumanWager(state, action.amount);
    case 'TOGGLE_PAUSE':
      if (state.phase === 'gameover') return state;
      return { ...state, paused: !state.paused };
    case 'RESTART':
      return createInitialState({
        mode: state.players.every((player) => player.isHuman) ? 'multiplayer' : 'solo',
        players: state.players.filter((player) => player.isHuman).map((player) => player.name),
      });
    default:
      return state;
  }
}
