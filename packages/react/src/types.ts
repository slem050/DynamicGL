import { LiveDataPoint } from '@dynamicgl/charts';

export type { LiveDataPoint };

export interface ChartCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string | number;
  children?: React.ReactNode;
  onResize?: (width: number, height: number) => void;
}

export interface LiveLineChartProps {
  data: LiveDataPoint[];
  color?: string | number;
  lineWidth?: number;
  windowMs?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
  autoScaleY?: boolean;
  yPadding?: number;
  // Styling options
  backgroundColor?: string | number;
  axisColor?: string | number;
  gridColor?: string | number;
  showAxes?: boolean;
  showGrid?: boolean;
  // Label options
  showLabels?: boolean;
  xTickCount?: number;
  yTickCount?: number;
  labelColor?: string;
  labelFormatter?: {
    x?: (value: number) => string;
    y?: (value: number) => string;
  };
}

