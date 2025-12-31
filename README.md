# DynamicGL

**GPU-accelerated charting framework for real-time data**

DynamicGL provides high-performance, real-time charts designed for live and streaming data. Built with WebGL via Three.js for smooth, low-latency visualizations with a modern React API.

## 🚀 Quick Start

### Installation

```bash
pnpm install @dynamicgl/react @dynamicgl/core @dynamicgl/charts @dynamicgl/theme
```

### Basic Usage

```tsx
import { ChartCanvas, LiveLineChart, useMockStream } from '@dynamicgl/react';

function MyChart() {
  const streamData = useMockStream(100, () => Math.random() * 100);
  
  return (
    <ChartCanvas width={800} height={400}>
      <LiveLineChart
        data={streamData}
        styling={{ lineColor: "#00ffcc" }}
        timeWindow={{ windowMs: 10000 }}
        domain={{ autoScaleY: true }}
      />
    </ChartCanvas>
  );
}
```

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Build packages
pnpm build:lib

# Start docs site
pnpm dev
```

## 📦 Packages

- `@dynamicgl/core` - Three.js engine, scaling, math utilities
- `@dynamicgl/charts` - Chart implementations and GPU buffer management
- `@dynamicgl/react` - React components and hooks
- `@dynamicgl/theme` - Styling and color presets

## 📚 Documentation

Visit the [documentation site](https://yourusername.github.io/DynamicGL/) or run locally:

```bash
pnpm dev
```

## 📄 License

MIT License
