'use client';

import { ChartCanvas, LiveLineChart } from '@dynamicgl/react';
import { useLiveData } from '@dynamicgl/react';
import { useEffect } from 'react';

// Simple test component to verify chart rendering
export function TestChart() {
  const { data, addPoint } = useLiveData();

  useEffect(() => {
    // Add some test data points
    const interval = setInterval(() => {
      const now = Date.now();
      addPoint({
        x: now,
        y: Math.sin(now / 1000) * 50 + 50,
      });
    }, 100);

    return () => clearInterval(interval);
  }, [addPoint]);

  return (
    <ChartCanvas width={800} height={400}>
      <LiveLineChart
        data={data}
        color="#00ffcc"
        windowMs={10000}
        autoScaleY
      />
    </ChartCanvas>
  );
}

