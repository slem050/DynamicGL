/**
 * Normalize a value from [min, max] to [0, 1]
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

/**
 * Denormalize a value from [0, 1] to [min, max]
 */
export function denormalize(value: number, min: number, max: number): number {
  return value * (max - min) + min;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Calculate the range of an array of numbers
 */
export function range(values: number[]): { min: number; max: number } {
  if (values.length === 0) {
    return { min: 0, max: 1 };
  }
  let min = values[0];
  let max = values[0];
  for (let i = 1; i < values.length; i++) {
    min = Math.min(min, values[i]);
    max = Math.max(max, values[i]);
  }
  return { min, max };
}

