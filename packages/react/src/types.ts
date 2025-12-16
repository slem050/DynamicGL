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
}

