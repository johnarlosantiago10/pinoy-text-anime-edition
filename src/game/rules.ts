import { CPU_NAMES, CPU_WAGER_OPTIONS, MIN_WAGER } from './constants';
import type { Landing, Player, Side } from './types';

export function clampHumanWager(amount: number, balance: number): number {
  return Math.min(Math.max(amount, MIN_WAGER), balance);
}

export function pickCpuWager(balance: number): number {
  const options = CPU_WAGER_OPTIONS.filter((wager) => wager >= MIN_WAGER && wager <= balance);
  return options[Math.floor(Math.random() * options.length)] ?? balance;
}

export function randomSide(): Side {
  return Math.random() < 0.5 ? 'CHA' : 'CHUB';
}

export function decideWinner(results: Record<string, Side>): string | null {
  const ids = Object.keys(results);
  for (const id of ids) {
    const mine = results[id];
    const others = ids.filter((other) => other !== id).map((other) => results[other]);
    const othersAgree = others.every((side) => side === others[0]);
    if (othersAgree && others[0] !== mine) return id;
  }
  return null;
}

const LANDING_ZONES = [
  { x: 22, y: 40 },
  { x: 50, y: 56 },
  { x: 78, y: 42 },
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function planLandings(ids: string[]): Record<string, Landing> {
  const zones = shuffle(LANDING_ZONES);
  const landings: Record<string, Landing> = {};
  ids.forEach((id, index) => {
    const zone = zones[index];
    landings[id] = {
      x: zone.x + (Math.random() - 0.5) * 6,
      y: zone.y + (Math.random() - 0.5) * 8,
      rot: (Math.random() - 0.5) * 36,
    };
  });
  return landings;
}

export function pickCpuName(players: Player[]): string {
  const inUse = new Set(players.map((player) => player.name));
  const available = CPU_NAMES.filter((name) => !inUse.has(name));
  const pool = available.length > 0 ? available : CPU_NAMES;
  return pool[Math.floor(Math.random() * pool.length)];
}
