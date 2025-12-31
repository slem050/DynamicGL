import { useEffect, useRef, useState, useCallback } from 'react';
import { LiveDataPoint } from '@dynamicgl/charts';

/**
 * Configuration for mock stream generator
 */
export interface MockStreamConfig {
  /** Interval between data points in milliseconds */
  intervalMs?: number;
  /** Generator function that returns Y value */
  generator?: () => number;
  /** Maximum number of points to keep (for memory management) */
  maxPoints?: number;
}

/**
 * Hook for generating mock streaming data (useful for demos)
 * 
 * Data is continuously appended - x values only increase (monotonically increasing)
 * Old data is automatically trimmed to prevent memory issues
 */
export function useMockStream(
  intervalMs: number = 100,
  generator: () => number = () => Math.random() * 100,
  maxPoints: number = 10000
): LiveDataPoint[] {
  const [data, setData] = useState<LiveDataPoint[]>([]);
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastXRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    lastXRef.current = startTimeRef.current;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      
      // Ensure x values only increase (monotonically increasing)
      const x = Math.max(now, lastXRef.current + 1);
      lastXRef.current = x;
      
      const newPoint: LiveDataPoint = {
        x,
        y: generator(),
      };

      setData((prev) => {
        // Always append new point - never replace
        const updated = [...prev, newPoint];
        // Trim old data if exceeds maxPoints (keep newest)
        if (updated.length > maxPoints) {
          return updated.slice(-maxPoints);
        }
        return updated;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalMs, generator, maxPoints]);

  return data;
}

/**
 * Configuration for live data stream
 */
export interface LiveDataConfig {
  /** Initial data points */
  initialData?: LiveDataPoint[];
  /** Maximum number of points to keep (for memory management) */
  maxPoints?: number;
}

/**
 * Hook for managing live data stream
 * 
 * Data is always appended - never replaced in place
 * Ensures x values are monotonically increasing
 */
export function useLiveData(config: LiveDataConfig = {}) {
  const { initialData = [], maxPoints = 10000 } = config;
  const [data, setData] = useState<LiveDataPoint[]>(initialData);
  const lastXRef = useRef<number>(0);

  // Initialize lastXRef from initial data
  useEffect(() => {
    if (initialData.length > 0) {
      const lastPoint = initialData[initialData.length - 1];
      lastXRef.current = lastPoint.x;
    }
  }, []);

  /**
   * Add a single point to the stream
   * Ensures x values only increase
   */
  const addPoint = useCallback((point: LiveDataPoint) => {
    setData((prev) => {
      // Ensure x values only increase
      const x = Math.max(point.x, lastXRef.current + 1);
      lastXRef.current = x;
      
      const newPoint: LiveDataPoint = { ...point, x };
      const updated = [...prev, newPoint];
      
      // Trim old data if exceeds maxPoints
      if (updated.length > maxPoints) {
        return updated.slice(-maxPoints);
      }
      return updated;
    });
  }, [maxPoints]);

  /**
   * Add multiple points to the stream
   * Ensures x values only increase and are in order
   */
  const addPoints = useCallback((points: LiveDataPoint[]) => {
    setData((prev) => {
      let currentX = lastXRef.current;
      const newPoints: LiveDataPoint[] = [];
      
      for (const point of points) {
        // Ensure x values only increase
        currentX = Math.max(point.x, currentX + 1);
        newPoints.push({ ...point, x: currentX });
      }
      
      lastXRef.current = currentX;
      const updated = [...prev, ...newPoints];
      
      // Trim old data if exceeds maxPoints
      if (updated.length > maxPoints) {
        return updated.slice(-maxPoints);
      }
      return updated;
    });
  }, [maxPoints]);

  /**
   * Clear all data
   */
  const clear = useCallback(() => {
    setData([]);
    lastXRef.current = 0;
  }, []);

  /**
   * Set data directly (use with caution - should only be used for initialization)
   */
  const setDataDirect = useCallback((newData: LiveDataPoint[]) => {
    setData(newData);
    if (newData.length > 0) {
      lastXRef.current = newData[newData.length - 1].x;
    } else {
      lastXRef.current = 0;
    }
  }, []);

  return {
    data,
    addPoint,
    addPoints,
    clear,
    setData: setDataDirect,
  };
}

