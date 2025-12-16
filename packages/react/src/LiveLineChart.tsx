import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LiveLineChart as LiveLineChartImpl } from '@dynamicgl/charts';
import { LiveLineChartProps } from './types';
import { TimeWindow } from '@dynamicgl/core';
import { BasicAxes } from './BasicAxes';
import { AxisLabels } from './AxisLabels';

/**
 * LiveLineChart - React component for rendering live streaming line charts
 * 
 * Usage:
 * ```tsx
 * <ChartCanvas>
 *   <LiveLineChart
 *     data={stream}
 *     color="#00ffcc"
 *     windowMs={10000}
 *   />
 * </ChartCanvas>
 * ```
 */
export function LiveLineChart({
  data,
  color = '#00ffcc',
  lineWidth = 2,
  windowMs = 10000,
  xDomain,
  yDomain,
  autoScaleY = false,
  yPadding = 0.1,
  // Styling options
  backgroundColor,
  axisColor = '#000000',
  gridColor = '#cccccc',
  showAxes = true,
  showGrid = true,
  // Label options
  showLabels = false,
  xTickCount = 5,
  yTickCount = 5,
  labelColor = '#666666',
  labelFormatter,
}: LiveLineChartProps) {
  const chartRef = useRef<LiveLineChartImpl | null>(null);
  const timeWindowRef = useRef<TimeWindow | null>(null);
  const lastDataLengthRef = useRef(0);
  const lastDomainRef = useRef<[number, number] | null>(null);
  const [isReady, setIsReady] = React.useState(false);
  const { viewport } = useThree();

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) {
      const capacity = Math.max(1000, Math.ceil(windowMs / 100) * 2); // Estimate capacity
      
      // Set initial domains
      const now = Date.now();
      const initialXDomain = xDomain ?? [now - windowMs, now];
      const initialYDomain = yDomain ?? [0, 100];
      
      chartRef.current = new LiveLineChartImpl({
        capacity,
        color,
        lineWidth,
        xDomain: initialXDomain,
        yDomain: initialYDomain,
      });

      // Set initial ranges to match default camera viewport (will be updated by viewport effect)
      chartRef.current.setXRange([-2, 2]);
      chartRef.current.setYRange([-1, 1]);

      timeWindowRef.current = new TimeWindow({ windowMs });
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
      timeWindowRef.current.setWindowMs(windowMs);
      timeWindowRef.current.update();
    }
  }, [windowMs]);

  // Update color and line width
  useEffect(() => {
    if (chartRef.current) {
      const material = chartRef.current.getObject3D().material as THREE.LineBasicMaterial;
      if (typeof color === 'string') {
        material.color.set(color);
      } else {
        material.color.setHex(color);
      }
      material.linewidth = lineWidth;
    }
  }, [color, lineWidth]);

  // Process data updates
  useEffect(() => {
    if (!chartRef.current || !timeWindowRef.current || !isReady) {
      return;
    }

    const chart = chartRef.current;
    const timeWindow = timeWindowRef.current;

    // Update time window to current time
    timeWindow.update();

    // Only update data if length changed
    if (data.length > lastDataLengthRef.current) {
      // Add only new points
      const newPoints = data.slice(lastDataLengthRef.current);
      if (newPoints.length > 0) {
        chart.addPoints(newPoints);
      }
    } else if (data.length < lastDataLengthRef.current) {
      // Data was cleared or reset - rebuild from scratch
      chart.clear();
      if (data.length > 0) {
        chart.addPoints(data);
      }
    } else if (data.length === 0 && lastDataLengthRef.current > 0) {
      // Data was cleared
      chart.clear();
    }
    // If length is the same, don't modify the buffer (points are already there)

    lastDataLengthRef.current = data.length;
  }, [data, isReady]);

  // Update domains when props change (not every frame)
  useEffect(() => {
    if (!chartRef.current || !timeWindowRef.current || !isReady) {
      return;
    }

    const chart = chartRef.current;
    const timeWindow = timeWindowRef.current;

    // Update X domain
    if (xDomain) {
      chart.setXDomain(xDomain);
    } else {
      // Always set X domain based on time window
      timeWindow.update();
      const [start, end] = timeWindow.getRange();
      chart.setXDomain([start, end]);
      // Update lastDomainRef so useFrame doesn't immediately update again
      lastDomainRef.current = [start, end];
    }

    // Update Y domain
    if (yDomain) {
      chart.setYDomain(yDomain);
    } else if (autoScaleY) {
      if (data.length > 0) {
        chart.autoScaleY(yPadding);
      } else {
        // Set default Y domain when autoScaleY is true but no data yet
        chart.setYDomain([0, 100]);
      }
    } else {
      // Set default Y domain if not auto-scaling
      chart.setYDomain([0, 100]);
    }
  }, [xDomain, yDomain, autoScaleY, yPadding, data.length, isReady]);

  // Update ranges based on viewport (separate effect to avoid clearing data)
  useEffect(() => {
    if (!chartRef.current || !isReady) return;

    const chart = chartRef.current;
    // Update ranges based on viewport
    if (viewport.width > 0 && viewport.height > 0) {
      const aspect = viewport.width / viewport.height;
      chart.setXRange([-aspect, aspect]);
      chart.setYRange([-1, 1]);
    } else {
      // Fallback if viewport not available yet - use default aspect for 800x400
      chart.setXRange([-2, 2]);
      chart.setYRange([-1, 1]);
    }
  }, [viewport, isReady]);

  // Set initial ranges when chart is ready
  useEffect(() => {
    if (!chartRef.current || !isReady) return;
    
    const chart = chartRef.current;
    // Set initial ranges (will be updated by viewport effect, but set defaults first)
    chart.setXRange([-2, 2]);
    chart.setYRange([-1, 1]);
  }, [isReady]);

  // Update geometry and time window every frame for smooth updates
  useFrame(() => {
    if (chartRef.current && timeWindowRef.current) {
      // Update time window to current time
      timeWindowRef.current.update();
      
      // Always update X domain if not explicitly set (for sliding window)
      if (!xDomain) {
        const [start, end] = timeWindowRef.current.getRange();
        // Only update if domain changed significantly to avoid unnecessary recalculations
        const domainChanged = !lastDomainRef.current || 
          Math.abs(lastDomainRef.current[0] - start) > 50 || // Update if changed by >50ms
          Math.abs(lastDomainRef.current[1] - end) > 50;
        
        if (domainChanged) {
          chartRef.current.setXDomain([start, end]);
          lastDomainRef.current = [start, end];
        }
      }
      
      // Update geometry (this will recalculate positions based on current domain/range)
      chartRef.current.update();
    }
  });

  // Get the Three.js object to render
  if (!isReady || !chartRef.current) return null;

  const lineObject = chartRef.current.getObject3D();
  
  // Get current domains for labels
  const currentXDomain = xDomain ?? (timeWindowRef.current ? timeWindowRef.current.getRange() : [0, 1]);
  
  // Calculate Y domain for labels
  let currentYDomain: [number, number] = yDomain ?? [0, 100];
  if (!yDomain && autoScaleY && data.length > 0) {
    const yValues = data.map(p => p.y);
    const min = Math.min(...yValues);
    const max = Math.max(...yValues);
    const padding = (max - min) * yPadding;
    currentYDomain = [min - padding, max + padding];
  }

  return (
    <>
      <primitive object={lineObject} />
      {(showAxes || showGrid) && (
        <BasicAxes
          axisColor={axisColor}
          gridColor={gridColor}
        />
      )}
      {showLabels && (
        <AxisLabels
          xDomain={currentXDomain}
          yDomain={currentYDomain}
          xTickCount={xTickCount}
          yTickCount={yTickCount}
          labelColor={labelColor}
          labelFormatter={labelFormatter}
        />
      )}
    </>
  );
}

