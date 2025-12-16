/**
 * Typography tokens
 */
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

/**
 * Spacing tokens
 */
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

/**
 * Border radius tokens
 */
export const borderRadius = {
  none: '0',
  sm: '2px',
  md: '4px',
  lg: '8px',
  full: '9999px',
} as const;

/**
 * Line width tokens for charts
 */
export const lineWidth = {
  thin: 1,
  normal: 2,
  thick: 3,
  extraThick: 4,
} as const;

