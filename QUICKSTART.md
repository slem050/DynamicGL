# Quick Start Guide

## Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start the development server
pnpm dev
```

The docs site will be available at `http://localhost:3000`

## Basic Example

```tsx
import { ChartCanvas, LiveLineChart, useMockStream } from '@dynamicgl/react';

function MyChart() {
  const streamData = useMockStream(100, () => Math.random() * 100);
  
  return (
    <ChartCanvas width={800} height={400}>
      <LiveLineChart
        data={streamData}
        color="#00ffcc"
        windowMs={10000}
        autoScaleY
      />
    </ChartCanvas>
  );
}
```

## Using with Real Data

```tsx
import { ChartCanvas, LiveLineChart, useLiveData } from '@dynamicgl/react';

function RealTimeChart() {
  const { data, addPoint } = useLiveData();
  
  useEffect(() => {
    // Connect to your data source
    const subscription = yourDataStream.subscribe((value) => {
      addPoint({
        x: Date.now(),
        y: value,
      });
    });
    
    return () => subscription.unsubscribe();
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
```

## Package Scripts

### Root Level
- `pnpm dev` - Start docs site
- `pnpm build` - Build all packages
- `pnpm typecheck` - Type check all packages

### Individual Packages
- `pnpm --filter @dynamicgl/core build` - Build core package
- `pnpm --filter @dynamicgl/charts build` - Build charts package
- `pnpm --filter @dynamicgl/react build` - Build react package
- `pnpm --filter @dynamicgl/theme build` - Build theme package

## Project Structure

```
dynamicgl/
├── apps/
│   └── docs-site/          # Next.js documentation & examples
├── packages/
│   ├── core/               # Core engine (math, scaling, buffers)
│   ├── charts/             # Chart implementations
│   ├── react/              # React components (public API)
│   └── theme/              # Theming and styling
└── pnpm-workspace.yaml     # Monorepo configuration
```

## Key Features

- ⚡ **GPU-accelerated** - WebGL rendering via Three.js
- 📈 **Real-time optimized** - Ring buffers, no per-frame allocations
- 🧩 **React-friendly** - Composable components
- 🎨 **Themable** - Dark/light presets included
- 📦 **Modular** - Use only what you need

## Next Steps

1. Explore the docs site examples
2. Check out the README for detailed documentation
3. Review the code in `packages/` to understand the architecture
4. Start building your own charts!

