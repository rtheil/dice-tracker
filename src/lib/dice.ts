export const FACES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type Roll = { value: number; at: number };

export type CurrentGame = {
  createdAt: number;
  rolls: Roll[];
};

export type SavedGame = {
  id: string;
  name: string;
  startedAt: number;
  endedAt: number;
  rolls: Roll[];
};

/** Number of two-dice combinations that produce `n` (also the pip count on a Catan token). */
export function ways(n: number): number {
  return 6 - Math.abs(n - 7);
}

/** Theoretical probability of rolling `n` with two dice, as a percentage. */
export function expectedPct(n: number): number {
  return (ways(n) / 36) * 100;
}

export function isHot(n: number): boolean {
  return n === 6 || n === 8;
}

export function countRolls(rolls: Roll[]): Record<number, number> {
  const counts: Record<number, number> = {};
  for (const n of FACES) counts[n] = 0;
  for (const r of rolls) counts[r.value] = (counts[r.value] ?? 0) + 1;
  return counts;
}
