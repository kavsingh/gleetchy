export const isFiniteNumber = (value: unknown): value is number =>
  Number.isFinite(value as number)
