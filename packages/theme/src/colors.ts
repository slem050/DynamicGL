/**
 * Color palette definitions
 */
export const colors = {
  // Primary colors
  primary: '#00ffcc',
  primaryDark: '#00cc99',
  primaryLight: '#33ffdd',

  // Accent colors
  accent: '#ff6b6b',
  accentDark: '#cc5555',
  accentLight: '#ff8888',

  // Neutral colors
  background: '#1a1a1a',
  backgroundLight: '#2a2a2a',
  backgroundDark: '#0a0a0a',
  foreground: '#ffffff',
  foregroundDim: '#999999',

  // Chart colors
  grid: '#333333',
  axis: '#666666',
  text: '#cccccc',
  textDim: '#888888',
} as const;

/**
 * Convert hex color to Three.js color number
 */
export function hexToColor(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

/**
 * Chart color palette for multiple series
 */
export const chartColors = [
  '#00ffcc',
  '#ff6b6b',
  '#4ecdc4',
  '#ffe66d',
  '#a8e6cf',
  '#ff8b94',
  '#95e1d3',
  '#f38181',
] as const;

