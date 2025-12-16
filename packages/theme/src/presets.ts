import { colors, hexToColor } from './colors';

/**
 * Theme preset configuration
 */
export interface ThemePreset {
  background: string | number;
  grid: string | number;
  axis: string | number;
  text: string | number;
  textDim: string | number;
  chartColors: (string | number)[];
}

/**
 * Dark theme preset (default)
 */
export const darkTheme: ThemePreset = {
  background: colors.background,
  grid: colors.grid,
  axis: colors.axis,
  text: colors.text,
  textDim: colors.textDim,
  chartColors: ['#00ffcc', '#ff6b6b', '#4ecdc4', '#ffe66d'],
};

/**
 * Light theme preset
 */
export const lightTheme: ThemePreset = {
  background: '#ffffff',
  grid: '#e0e0e0',
  axis: '#999999',
  text: '#333333',
  textDim: '#666666',
  chartColors: ['#0066cc', '#cc0000', '#009966', '#cc9900'],
};

/**
 * Get theme colors as Three.js color numbers
 */
export function getThemeColors(theme: ThemePreset): {
  background: number;
  grid: number;
  axis: number;
  text: number;
  textDim: number;
  chartColors: number[];
} {
  const toColor = (c: string | number): number => {
    return typeof c === 'string' ? hexToColor(c) : c;
  };

  return {
    background: toColor(theme.background),
    grid: toColor(theme.grid),
    axis: toColor(theme.axis),
    text: toColor(theme.text),
    textDim: toColor(theme.textDim),
    chartColors: theme.chartColors.map(toColor),
  };
}

