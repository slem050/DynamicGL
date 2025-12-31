import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LiveLineChart as LiveLineChartImpl } from '@dynamicgl/charts';
import { LiveLineChartProps } from '../../types/types';
import { LineChartStyling, ChartDomain, ChartTimeWindow, ChartLabels, ChartVisibility, ChartValues } from '../../types/interfaces';
import { TimeWindow } from '@dynamicgl/core';
import { BasicAxes } from '../axes/BasicAxes';
import { AxisLabels } from '../axes/AxisLabels';
import { ValueDisplay } from '../display/ValueDisplay';

/**
 * Helper to merge legacy flat props with grouped config objects
 */
function mergeConfig(props: LiveLineChartProps): {
  styling: Required<Omit<LineChartStyling, 'backgroundColor'>> & { backgroundColor?: string | number };
  domain: Required<Omit<ChartDomain, 'xDomain' | 'yDomain'>> & { xDomain?: [number, number]; yDomain?: [number, number] };
  timeWindow: Required<ChartTimeWindow>;
  labels: Required<Omit<ChartLabels, 'formatter'>> & { formatter?: ChartLabels['formatter'] };
  visibility: Required<ChartVisibility>;
  values: Required<ChartValues>;
} {
  return {
    styling: {
      lineColor: props.styling?.lineColor ?? props.color ?? '#00ffcc',
      lineWidth: props.styling?.lineWidth ?? props.lineWidth ?? 2,
      backgroundColor: props.styling?.backgroundColor ?? props.backgroundColor,
      axisColor: props.styling?.axisColor ?? props.axisColor ?? '#000000',
      gridColor: props.styling?.gridColor ?? props.gridColor ?? '#cccccc',
    },
    domain: {
      xDomain: props.domain?.xDomain ?? props.xDomain,
      yDomain: props.domain?.yDomain ?? props.yDomain,
      autoScaleY: props.domain?.autoScaleY ?? props.autoScaleY ?? false,
      yPadding: props.domain?.yPadding ?? props.yPadding ?? 0.1,
    },
    timeWindow: {
      windowMs: props.timeWindow?.windowMs ?? props.windowMs ?? 10000,
    },
    labels: {
      enabled: props.labels?.enabled ?? props.showLabels ?? false,
      xTickCount: props.labels?.xTickCount ?? props.xTickCount ?? 5,
      yTickCount: props.labels?.yTickCount ?? props.yTickCount ?? 5,
      color: props.labels?.color ?? props.labelColor ?? '#666666',
      formatter: props.labels?.formatter ?? props.labelFormatter,
    },
    visibility: {
      showAxes: props.visibility?.showAxes ?? props.showAxes ?? true,
      showGrid: props.visibility?.showGrid ?? props.showGrid ?? true,
    },
    values: {
      enabled: props.values?.enabled ?? props.showValues ?? false,
      showLatest: props.values?.showLatest ?? props.showLatest ?? true,
      showOnHover: props.values?.showOnHover ?? props.showOnHover ?? false,
      position: props.values?.position ?? props.valuePosition ?? 'top-right',
      textColor: props.values?.textColor ?? props.valueTextColor ?? '#000000',
      backgroundColor: props.values?.backgroundColor ?? props.valueBackgroundColor ?? 'rgba(255, 255, 255, 0.9)',
    },
  };
}

/**
 * LiveLineChart - React component for rendering live streaming line charts
 * 
 * Usage with grouped config (recommended):
 * ```tsx
 * <ChartCanvas>
 *   <LiveLineChart
 *     data={stream}
 *     styling={{ color: "#00ffcc", lineWidth: 2 }}
 *     timeWindow={{ windowMs: 10000 }}
 *     domain={{ autoScaleY: true }}
 *     labels={{ enabled: true }}
 *     visibility={{ showAxes: true, showGrid: true }}
 *     values={{ enabled: true, showLatest: true }}
 *   />
 * </ChartCanvas>
 * ```
 * 
 * Legacy flat props are still supported for backward compatibility.
 */
export function LiveLineChart(props: LiveLineChartProps) {
  const { data } = props;
  const config = mergeConfig(props);
  const { styling, domain, timeWindow, labels, visibility, values } = config;

  const chartRef = useRef<LiveLineChartImpl | null>(null);
  const timeWindowRef = useRef<TimeWindow | null>(null);
  const lastDataLengthRef = useRef(0);
  const lastDomainRef = useRef<[number, number] | null>(null);
  const [isReady, setIsReady] = React.useState(false);
  const { viewport } = useThree();
  const [currentXRange, setCurrentXRange] = React.useState<[number, number]>([-2, 2]);
  const [currentYRange, setCurrentYRange] = React.useState<[number, number]>([-1, 1]);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) {
      const capacity = Math.max(1000, Math.ceil(timeWindow.windowMs / 100) * 2);
      
      // Set initial domains
      const now = Date.now();
      const initialXDomain = domain.xDomain ?? [now - timeWindow.windowMs, now];
      const initialYDomain = domain.yDomain ?? [0, 100];
      
      chartRef.current = new LiveLineChartImpl({
        capacity,
        color: styling.lineColor,
        lineWidth: styling.lineWidth,
        xDomain: initialXDomain,
        yDomain: initialYDomain,
      });

      chartRef.current.setXRange([-2, 2]);
      chartRef.current.setYRange([-1, 1]);

      timeWindowRef.current = new TimeWindow({ windowMs: timeWindow.windowMs });
      setIsReady(true);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
        setIsReady(false);
      }
    };
  }, []);

  // Update time window
  useEffect(() => {
    if (timeWindowRef.current) {
      timeWindowRef.current.setWindowMs(timeWindow.windowMs);
      timeWindowRef.current.update();
    }
  }, [timeWindow.windowMs]);

  // Update color and line width
  useEffect(() => {
    if (chartRef.current) {
      const material = chartRef.current.getObject3D().material as THREE.LineBasicMaterial;
      if (typeof styling.lineColor === 'string') {
        material.color.set(styling.lineColor);
      } else {
        material.color.setHex(styling.lineColor);
      }
      material.linewidth = styling.lineWidth;
    }
  }, [styling.lineColor, styling.lineWidth]);

  // Process data updates
  useEffect(() => {
    if (!chartRef.current || !timeWindowRef.current || !isReady) {
      return;
    }

    const chart = chartRef.current;
    const timeWindow = timeWindowRef.current;

    timeWindow.update();

    if (data.length > lastDataLengthRef.current) {
      const newPoints = data.slice(lastDataLengthRef.current);
      if (newPoints.length > 0) {
        chart.addPoints(newPoints);
      }
    } else if (data.length < lastDataLengthRef.current) {
      chart.clear();
      if (data.length > 0) {
        chart.addPoints(data);
      }
    } else if (data.length === 0 && lastDataLengthRef.current > 0) {
      chart.clear();
    }

    lastDataLengthRef.current = data.length;
  }, [data, isReady]);

  // Update domains when props change
  useEffect(() => {
    if (!chartRef.current || !timeWindowRef.current || !isReady) {
      return;
    }

    const chart = chartRef.current;
    const timeWindow = timeWindowRef.current;

    // Update X domain
    if (domain.xDomain) {
      chart.setXDomain(domain.xDomain);
    } else {
      timeWindow.update();
      const [start, end] = timeWindow.getRange();
      chart.setXDomain([start, end]);
      lastDomainRef.current = [start, end];
    }

    // Update Y domain
    if (domain.yDomain) {
      chart.setYDomain(domain.yDomain);
    } else if (domain.autoScaleY) {
      if (data.length > 0) {
        chart.autoScaleY(domain.yPadding);
      } else {
        chart.setYDomain([0, 100]);
      }
    } else {
      chart.setYDomain([0, 100]);
    }
  }, [domain.xDomain, domain.yDomain, domain.autoScaleY, domain.yPadding, data.length, isReady]);

  // Update ranges based on viewport
  useEffect(() => {
    if (!chartRef.current || !isReady) return;

    const chart = chartRef.current;
    if (viewport.width > 0 && viewport.height > 0) {
      const aspect = viewport.width / viewport.height;
      const xRange: [number, number] = [-aspect, aspect];
      const yRange: [number, number] = [-1, 1];
      chart.setXRange(xRange);
      chart.setYRange(yRange);
      setCurrentXRange(xRange);
      setCurrentYRange(yRange);
    } else {
      const xRange: [number, number] = [-2, 2];
      const yRange: [number, number] = [-1, 1];
      chart.setXRange(xRange);
      chart.setYRange(yRange);
      setCurrentXRange(xRange);
      setCurrentYRange(yRange);
    }
  }, [viewport, isReady]);

  // Set initial ranges when chart is ready
  useEffect(() => {
    if (!chartRef.current || !isReady) return;
    
    const chart = chartRef.current;
    chart.setXRange([-2, 2]);
    chart.setYRange([-1, 1]);
  }, [isReady]);

  // Update geometry and time window every frame
  useFrame(() => {
    if (chartRef.current && timeWindowRef.current) {
      timeWindowRef.current.update();
      
      if (!domain.xDomain) {
        const [start, end] = timeWindowRef.current.getRange();
        const domainChanged = !lastDomainRef.current || 
          Math.abs(lastDomainRef.current[0] - start) > 50 ||
          Math.abs(lastDomainRef.current[1] - end) > 50;
        
        if (domainChanged) {
          chartRef.current.setXDomain([start, end]);
          lastDomainRef.current = [start, end];
        }
      }
      
      chartRef.current.update();
    }
  });

  if (!isReady || !chartRef.current) return null;

  const lineObject = chartRef.current.getObject3D();
  
  // Get current domains for labels
  const currentXDomain = domain.xDomain ?? (timeWindowRef.current ? timeWindowRef.current.getRange() : [0, 1]);
  
  // Calculate Y domain for labels
  let currentYDomain: [number, number] = domain.yDomain ?? [0, 100];
  if (!domain.yDomain && domain.autoScaleY && data.length > 0) {
    const yValues = data.map(p => p.y);
    const min = Math.min(...yValues);
    const max = Math.max(...yValues);
    const padding = (max - min) * domain.yPadding;
    currentYDomain = [min - padding, max + padding];
  }

  return (
    <>
      <primitive object={lineObject} />
      {(visibility.showAxes || visibility.showGrid) && (
        <BasicAxes
          axisColor={styling.axisColor}
          gridColor={styling.gridColor}
        />
      )}
      {labels.enabled && (
        <AxisLabels
          xDomain={currentXDomain}
          yDomain={currentYDomain}
          xTickCount={labels.xTickCount}
          yTickCount={labels.yTickCount}
          labelColor={labels.color}
          labelFormatter={labels.formatter}
        />
      )}
      {values.enabled && (
        <ValueDisplay
          data={data}
          xDomain={currentXDomain}
          yDomain={currentYDomain}
          xRange={currentXRange}
          yRange={currentYRange}
          showLatest={values.showLatest}
          showOnHover={values.showOnHover}
          xFormatter={labels.formatter?.x}
          yFormatter={labels.formatter?.y}
          position={values.position}
          textColor={values.textColor}
          backgroundColor={values.backgroundColor}
        />
      )}
    </>
  );
}
