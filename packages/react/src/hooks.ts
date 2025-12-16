import { useEffect, useRef, useState } from 'react';
import { LiveDataPoint } from '@dynamicgl/charts';

/**
 * Hook for generating mock streaming data (useful for demos)
 */
export function useMockStream(
  intervalMs: number = 100,
  generator: () => number = () => Math.random() * 100
): LiveDataPoint[] {
  const [data, setData] = useState<LiveDataPoint[]>([]);
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const newPoint: LiveDataPoint = {
        x: now,
        y: generator(),
      };

      setData((prev) => {
        // Keep only last 1000 points
        const updated = [...prev, newPoint];
        return updated.slice(-1000);
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalMs, generator]);

  return data;
}

/**
 * Hook for managing live data stream
 */
export function useLiveData(initialData: LiveDataPoint[] = []) {
  const [data, setData] = useState<LiveDataPoint[]>(initialData);

  const addPoint = (point: LiveDataPoint) => {
    setData((prev) => [...prev, point]);
  };

  const addPoints = (points: LiveDataPoint[]) => {
    setData((prev) => [...prev, ...points]);
  };

  const clear = () => {
    setData([]);
  };

  const setDataDirect = (newData: LiveDataPoint[]) => {
    setData(newData);
  };

  return {
    data,
    addPoint,
    addPoints,
    clear,
    setData: setDataDirect,
  };
}

