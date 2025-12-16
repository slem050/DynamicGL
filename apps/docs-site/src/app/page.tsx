'use client';

import { ChartCanvas, BasicAxes } from '@dynamicgl/react';
import { darkTheme } from '@dynamicgl/theme';

export default function Home() {
  return (
    <main style={{ padding: '2rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: darkTheme.chartColors[0] }}>
            DynamicGL
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#999', marginBottom: '2rem' }}>
            GPU-accelerated charting framework for real-time data
          </p>
        </header>

        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Coordinate System</h2>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            X and Y axes with grid - white background, black axes, gray grid.
          </p>
          <div style={{ width: '100%', height: '400px', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
            <ChartCanvas height={400} backgroundColor="#ffffff">
              <BasicAxes axisColor="#000000" gridColor="#cccccc" />
            </ChartCanvas>
          </div>
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Features</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>⚡ GPU-accelerated rendering with WebGL</li>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>📈 Optimized for live/streaming data</li>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>🧩 Composable React components</li>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>🚀 Zero per-frame allocations</li>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>💾 Fixed-size ring buffers for efficiency</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Usage</h2>
          <pre
            style={{
              background: '#0a0a0a',
              padding: '1.5rem',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.9rem',
              lineHeight: '1.6',
            }}
          >
            <code>{`import { ChartCanvas, LiveLineChart } from '@dynamicgl/react';

function MyChart() {
  const data = useLiveData();
  
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
}`}</code>
          </pre>
        </section>
      </div>
    </main>
  );
}

