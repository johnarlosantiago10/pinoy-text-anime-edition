import { LANDING_FRACTION } from './constants';
import type { Landing } from './types';

export interface Pose {
  x: number;
  y: number;
  lift: number;
  spin: number;
  tilt: number;
}

interface Point {
  x: number;
  y: number;
}

const BOUNCES = [
  { start: 0, width: 0.4, amplitude: 0.42 },
  { start: 0.4, width: 0.26, amplitude: 0.14 },
  { start: 0.66, width: 0.16, amplitude: 0.04 },
];

const FLIGHT_PEAK = 0.9;
const SPIN_DEGREES = 1080;

function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function easeOut(amount: number): number {
  return 1 - (1 - amount) * (1 - amount);
}

function bounceLift(progress: number): number {
  for (const bounce of BOUNCES) {
    const local = progress - bounce.start;
    if (local >= 0 && local <= bounce.width) {
      return bounce.amplitude * Math.sin((Math.PI * local) / bounce.width);
    }
  }
  return 0;
}

export function throwPose(t: number, start: Point, landing: Landing): Pose {
  const clamped = Math.min(Math.max(t, 0), 1);

  if (clamped < LANDING_FRACTION) {
    const flight = clamped / LANDING_FRACTION;
    const eased = easeOut(flight);
    return {
      x: lerp(start.x, landing.x, eased),
      y: lerp(start.y, landing.y, eased),
      lift: FLIGHT_PEAK * Math.sin(Math.PI * flight),
      spin: SPIN_DEGREES * (1 - flight),
      tilt: landing.rot * eased,
    };
  }

  return {
    x: landing.x,
    y: landing.y,
    lift: bounceLift((clamped - LANDING_FRACTION) / (1 - LANDING_FRACTION)),
    spin: 0,
    tilt: landing.rot,
  };
}
