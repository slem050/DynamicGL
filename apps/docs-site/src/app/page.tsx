'use client';

import { ChartCanvas, LiveLineChart, useMockStream, useLiveData } from '@dynamicgl/react';
import { darkTheme } from '@dynamicgl/theme';
import { useEffect } from 'react';

// Example 1: Sine wave with fast updates
function SineWaveExample() {
  const streamData = useMockStream(50, () => Math.sin(Date.now() / 1000) * 50 + 50);
  
  return (
    <div style={{ marginBottom: '3rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sine Wave (Fast Updates)</h3>
      <p style={{ color: '#999', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Continuous sine wave with 50ms updates - data flows from left to right
      </p>
      <div style={{ width: '100%', height: '300px', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
        <ChartCanvas height={300} backgroundColor="#ffffff">
          <LiveLineChart
            data={streamData}
            styling={{
              lineColor: darkTheme.chartColors[0],
              axisColor: '#000000',
              gridColor: '#e0e0e0',
            }}
            timeWindow={{ windowMs: 10000 }}
            domain={{ autoScaleY: true }}
            labels={{
              enabled: true,
              xTickCount: 5,
              yTickCount: 5,
              color: '#666666',
            }}
            visibility={{ showAxes: true, showGrid: true }}
            values={{ enabled: true, showLatest: true, showOnHover: true }}
          />
        </ChartCanvas>
      </div>
    </div>
  );
}

// Example 2: Random data with medium speed
function RandomDataExample() {
  const streamData = useMockStream(200, () => Math.random() * 100);
  
  return (
    <div style={{ marginBottom: '3rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Random Data (Medium Speed)</h3>
      <p style={{ color: '#999', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Random values with 200ms updates - demonstrates continuous data appending
      </p>
      <div style={{ width: '100%', height: '300px', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
        <ChartCanvas height={300} backgroundColor="#ffffff">
          <LiveLineChart
            data={streamData}
            color={darkTheme.chartColors[1]}
            windowMs={15000}
            autoScaleY
            showAxes={true}
            showGrid={true}
            showLabels={true}
            axisColor="#000000"
            gridColor="#e0e0e0"
            labelColor="#666666"
            showValues={true}
            showLatest={true}
            showOnHover={true}
          />
        </ChartCanvas>
      </div>
    </div>
  );
}

// Example 3: Complex waveform
function ComplexWaveformExample() {
  const streamData = useMockStream(100, () => {
    const t = Date.now() / 1000;
    return Math.sin(t) * 30 + Math.sin(t * 2.5) * 20 + Math.sin(t * 0.5) * 10 + 50;
  });
  
  return (
    <div style={{ marginBottom: '3rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Complex Waveform</h3>
      <p style={{ color: '#999', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Multiple sine waves combined - shows smooth continuous data flow
      </p>
      <div style={{ width: '100%', height: '300px', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
        <ChartCanvas height={300} backgroundColor="#ffffff">
          <LiveLineChart
            data={streamData}
            color={darkTheme.chartColors[2]}
            windowMs={12000}
            autoScaleY
            showAxes={true}
            showGrid={true}
            showLabels={true}
            axisColor="#000000"
            gridColor="#e0e0e0"
            labelColor="#666666"
            showValues={true}
            showLatest={true}
            showOnHover={true}
          />
        </ChartCanvas>
      </div>
    </div>
  );
}

// Example 4: Manual data addition (simulating real-world use case)
function ManualDataExample() {
  const { data, addPoint } = useLiveData();
  
  useEffect(() => {
    let counter = 0;
    const interval = setInterval(() => {
      const now = Date.now();
      // Simulate sensor data that increases over time
      const value = Math.sin(counter * 0.1) * 40 + 50 + (counter * 0.1);
      addPoint({ x: now, y: value });
      counter++;
    }, 150);
    
    return () => clearInterval(interval);
  }, [addPoint]);
  
  return (
    <div style={{ marginBottom: '3rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Manual Data Stream</h3>
      <p style={{ color: '#999', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Using useLiveData hook - data is manually added and always appended (never replaced)
      </p>
      <div style={{ width: '100%', height: '300px', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
        <ChartCanvas height={300} backgroundColor="#ffffff">
          <LiveLineChart
            data={data}
            color={darkTheme.chartColors[3]}
            windowMs={8000}
            autoScaleY
            showAxes={true}
            showGrid={true}
            showLabels={true}
            axisColor="#000000"
            gridColor="#e0e0e0"
            labelColor="#666666"
            showValues={true}
            showLatest={true}
            showOnHover={true}
          />
        </ChartCanvas>
      </div>
    </div>
  );
}

// Example 5: Slow updates with long window
function SlowUpdatesExample() {
  const streamData = useMockStream(500, () => {
    const t = Date.now() / 2000;
    return Math.sin(t) * 25 + 50;
  });
  
  return (
    <div style={{ marginBottom: '3rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Slow Updates (Long Window)</h3>
      <p style={{ color: '#999', marginBottom: '1rem', fontSize: '0.9rem' }}>
        500ms updates with 20 second window - shows how x-axis continuously moves forward
      </p>
      <div style={{ width: '100%', height: '300px', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
        <ChartCanvas height={300} backgroundColor="#ffffff">
          <LiveLineChart
            data={streamData}
            color="#00ffcc"
            windowMs={20000}
            autoScaleY
            showAxes={true}
            showGrid={true}
            showLabels={true}
            axisColor="#000000"
            gridColor="#e0e0e0"
            labelColor="#666666"
            labelFormatter={{
              x: (value) => new Date(value).toLocaleTimeString(),
            }}
          />
        </ChartCanvas>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main style={{ padding: '2rem', minHeight: '100vh', background: '#0a0a0a', color: '#ffffff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: String(darkTheme.chartColors[0]) }}>
            DynamicGL
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#999', marginBottom: '2rem' }}>
            GPU-accelerated charting framework for real-time data
          </p>
        </header>

        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Live Data Examples</h2>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            All examples demonstrate continuous data appending - data flows from left to right,
            x-axis values only increase, and the graph moves forward as new data arrives.
          </p>
          
          <SineWaveExample />
          <RandomDataExample />
          <ComplexWaveformExample />
          <ManualDataExample />
          <SlowUpdatesExample />
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Features</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>⚡ GPU-accelerated rendering with WebGL</li>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>📈 Optimized for live/streaming data</li>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>🧩 Composable React components</li>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>🚀 Zero per-frame allocations</li>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>💾 Fixed-size ring buffers for efficiency</li>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>➡️ Continuous data appending (never replaces in place)</li>
            <li style={{ padding: '0.5rem 0', color: '#ccc' }}>📊 Monotonically increasing x-axis values</li>
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
              border: '1px solid #333',
            }}
          >
            <code>{`import { ChartCanvas, LiveLineChart, useMockStream, useLiveData } from '@dynamicgl/react';

// Option 1: Using mock stream hook
function MyChart() {
  const data = useMockStream(100, () => Math.random() * 100);
  
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

// Option 2: Manual data management
function MyManualChart() {
  const { data, addPoint } = useLiveData();
  
  useEffect(() => {
    const interval = setInterval(() => {
      addPoint({ x: Date.now(), y: Math.random() * 100 });
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
}`}</code>
          </pre>
        </section>
      </div>
    </main>
  );
}
