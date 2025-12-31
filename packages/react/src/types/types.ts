import { LiveDataPoint } from '@dynamicgl/charts';
import { LiveLineChartConfig } from './interfaces';

export type { LiveDataPoint };

/**
 * ChartCanvas styling configuration
 */
export interface ChartCanvasStyling {
  /** Background color */
  backgroundColor?: string | number;
}

/**
 * ChartCanvas size configuration
 */
export interface ChartCanvasSize {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
}

/**
 * ChartCanvas props with grouped configuration
 */
export interface ChartCanvasProps extends ChartCanvasSize, ChartCanvasStyling {
  children?: React.ReactNode;
  onResize?: (width: number, height: number) => void;
}

/**
 * Props for LiveLineChart component
 * Supports both new grouped config style and legacy flat props for backward compatibility
 */
export interface LiveLineChartProps extends Partial<LiveLineChartConfig> {
  /** Array of data points to display */
  data: Array<{ x: number; y: number }>;
  
  // Legacy flat props (deprecated - use grouped config objects instead)
  /** @deprecated Use styling.lineColor instead */
  color?: string | number;
  /** @deprecated Use styling.lineWidth instead */
  lineWidth?: number;
  /** @deprecated Use styling.backgroundColor instead */
  backgroundColor?: string | number;
  /** @deprecated Use styling.axisColor instead */
  axisColor?: string | number;
  /** @deprecated Use styling.gridColor instead */
  gridColor?: string | number;
  /** @deprecated Use domain.xDomain instead */
  xDomain?: [number, number];
  /** @deprecated Use domain.yDomain instead */
  yDomain?: [number, number];
  /** @deprecated Use domain.autoScaleY instead */
  autoScaleY?: boolean;
  /** @deprecated Use domain.yPadding instead */
  yPadding?: number;
  /** @deprecated Use timeWindow.windowMs instead */
  windowMs?: number;
  /** @deprecated Use visibility.showAxes instead */
  showAxes?: boolean;
  /** @deprecated Use visibility.showGrid instead */
  showGrid?: boolean;
  /** @deprecated Use labels.enabled instead */
  showLabels?: boolean;
  /** @deprecated Use labels.xTickCount instead */
  xTickCount?: number;
  /** @deprecated Use labels.yTickCount instead */
  yTickCount?: number;
  /** @deprecated Use labels.color instead */
  labelColor?: string;
  /** @deprecated Use labels.formatter instead */
  labelFormatter?: {
    x?: (value: number) => string;
    y?: (value: number) => string;
  };
  /** @deprecated Use values.enabled instead */
  showValues?: boolean;
  /** @deprecated Use values.showLatest instead */
  showLatest?: boolean;
  /** @deprecated Use values.showOnHover instead */
  showOnHover?: boolean;
  /** @deprecated Use values.position instead */
  valuePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** @deprecated Use values.textColor instead */
  valueTextColor?: string;
  /** @deprecated Use values.backgroundColor instead */
  valueBackgroundColor?: string;
}
