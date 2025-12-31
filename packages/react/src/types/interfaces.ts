/**
 * Base styling configuration that all chart types inherit from
 */
export interface BaseChartStyling {
  /** Background color */
  backgroundColor?: string | number;
  /** Axis line color */
  axisColor?: string | number;
  /** Grid line color */
  gridColor?: string | number;
}

/**
 * Line chart specific styling (extends base styling)
 */
export interface LineChartStyling extends BaseChartStyling {
  /** Line color (hex string or Three.js color number) */
  lineColor?: string | number;
  /** Line width in pixels */
  lineWidth?: number;
}

/**
 * Domain configuration for chart data ranges
 */
export interface ChartDomain {
  /** X-axis domain [min, max] - if not provided, uses time window */
  xDomain?: [number, number];
  /** Y-axis domain [min, max] - if not provided, uses auto-scale or default */
  yDomain?: [number, number];
  /** Automatically scale Y-axis based on data */
  autoScaleY?: boolean;
  /** Padding factor for auto-scaling (0-1) */
  yPadding?: number;
}

/**
 * Time window configuration for live data
 */
export interface ChartTimeWindow {
  /** Time window size in milliseconds */
  windowMs?: number;
}

/**
 * Label configuration for axis labels
 */
export interface ChartLabels {
  /** Show axis labels */
  enabled?: boolean;
  /** Number of X-axis ticks */
  xTickCount?: number;
  /** Number of Y-axis ticks */
  yTickCount?: number;
  /** Label text color */
  color?: string;
  /** Custom formatters for axis labels */
  formatter?: {
    x?: (value: number) => string;
    y?: (value: number) => string;
  };
}

/**
 * Grid and axes visibility configuration
 */
export interface ChartVisibility {
  /** Show axes lines */
  showAxes?: boolean;
  /** Show grid lines */
  showGrid?: boolean;
}

/**
 * Value display configuration
 */
export interface ChartValues {
  /** Show x and y values */
  enabled?: boolean;
  /** Show latest point values */
  showLatest?: boolean;
  /** Show values on hover */
  showOnHover?: boolean;
  /** Display position for value box */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Value text color */
  textColor?: string;
  /** Value background color */
  backgroundColor?: string;
}

/**
 * Base chart configuration that all chart types inherit from
 * Contains common properties shared across all chart types
 */
export interface BaseChartConfig {
  /** Array of data points to display */
  data: Array<{ x: number; y: number }>;
  /** Base styling configuration */
  styling?: BaseChartStyling;
  /** Domain configuration */
  domain?: ChartDomain;
  /** Time window configuration */
  timeWindow?: ChartTimeWindow;
  /** Label configuration */
  labels?: ChartLabels;
  /** Visibility configuration */
  visibility?: ChartVisibility;
  /** Value display configuration */
  values?: ChartValues;
}

/**
 * Live line chart specific configuration
 * Extends base chart config with line-specific styling
 */
export interface LiveLineChartConfig extends Omit<BaseChartConfig, 'styling'> {
  /** Line chart specific styling */
  styling?: LineChartStyling;
}

// Legacy interfaces for backward compatibility (deprecated)
/**
 * @deprecated Use LineChartStyling instead
 */
export interface ChartStyling extends LineChartStyling {}

/**
 * @deprecated Use ChartDomain instead
 */
export interface ChartDomainConfig extends ChartDomain {}

/**
 * @deprecated Use ChartTimeWindow instead
 */
export interface ChartTimeWindowConfig extends ChartTimeWindow {}

/**
 * @deprecated Use ChartLabels instead
 */
export interface ChartLabelConfig extends ChartLabels {}

/**
 * @deprecated Use ChartVisibility instead
 */
export interface ChartVisibilityConfig extends ChartVisibility {}

/**
 * @deprecated Use ChartValues instead
 */
export interface ChartValueDisplayConfig extends ChartValues {}
