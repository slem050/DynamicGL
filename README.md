# DynamicGL

**GPU-accelerated charting framework for real-time data**

DynamicGL provides high-performance, real-time charts designed for live and streaming data. Unlike traditional SVG or Canvas-based chart libraries, DynamicGL uses WebGL via Three.js to deliver smooth, low-latency visualizations with a modern React-friendly API.

## 🎯 Vision

Build an Ant Design–style charting ecosystem focused on:

- 📈 **Live / streaming data** - Optimized for real-time updates
- ⚡ **GPU-accelerated rendering** - WebGL-powered for maximum performance
- 🧩 **Composable React components** - Clean, intuitive API
- 🧠 **Predictable, extensible core** - Well-architected foundation
- 🧪 **Interactive documentation & playground** - Learn by example

## 🚫 Non-Goals

- ❌ Not a wrapper around Chart.js, D3, or ECharts
- ❌ Not SVG-based
- ❌ Not optimized for static charts
- ❌ Not a dashboard UI framework (charts only)

## 🎯 Target Use Cases

- Observability / monitoring dashboards
- Financial / trading charts
- IoT & telemetry streams
- Performance analytics
- Real-time simulation data

## 🏗️ Architecture

```
dynamicgl/
│
├─ apps/
│   └─ docs-site/            # Documentation & live examples
│
├─ packages/
│   ├─ core/                 # Three.js engine, math, scaling
│   ├─ charts/               # Chart implementations
│   ├─ react/                # Public React API
│   └─ theme/                # Styling, colors, presets
│
├─ pnpm-workspace.yaml
├─ package.json
└─ README.md
```

## 🛠️ Tech Stack

| Area | Technology |
|------|-----------|
| Language | TypeScript |
| UI | React |
| Docs | Next.js |
| Rendering | Three.js |
| React 3D | @react-three/fiber |
| Package Manager | pnpm |
| Monorepo | pnpm workspaces |
| Package Build | Vite |

## 📦 Packages

### `@dynamicgl/core`

Pure engine layer – no React dependencies.

**Responsibilities:**
- Coordinate system
- Axes and grid helpers
- Data normalization & scaling
- Time window handling
- Buffer utilities
- Performance helpers

### `@dynamicgl/charts`

Chart geometry and GPU buffer management.

**Responsibilities:**
- Chart geometry
- GPU buffer management
- Live data updates
- Zero DOM access
- No renderer ownership

**First Chart:** Live Line Chart with fixed-size ring buffer and geometry reuse.

### `@dynamicgl/react`

Public React components and hooks.

**Responsibilities:**
- Public React components
- Hooks for live data
- Chart lifecycle management
- Integration with render loop

### `@dynamicgl/theme`

Styling and theming.

**Responsibilities:**
- Color palettes
- Axis & grid styles
- Dark / light presets
- Typography tokens

## 🚀 Getting Started

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/DynamicGL.git
cd DynamicGL

# Install dependencies
pnpm install

# Build all packages
pnpm build:packages

# Start the docs site
pnpm dev
```

### Using Published Packages

Once published to npm:

```bash
npm install @dynamicgl/react @dynamicgl/core @dynamicgl/charts @dynamicgl/theme
```

Or with pnpm:
```bash
pnpm add @dynamicgl/react @dynamicgl/core @dynamicgl/charts @dynamicgl/theme
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
        color="#00ffcc"
        windowMs={10000}
        autoScaleY
      />
    </ChartCanvas>
  );
}
```

### Using with Real Data

```tsx
import { ChartCanvas, LiveLineChart, useLiveData } from '@dynamicgl/react';

function RealTimeChart() {
  const { data, addPoint } = useLiveData();
  
  useEffect(() => {
    const interval = setInterval(() => {
      addPoint({
        x: Date.now(),
        y: getCurrentValue(), // Your data source
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
```

## 🎨 Theming

```tsx
import { darkTheme, lightTheme } from '@dynamicgl/theme';

// Use theme colors
<ChartCanvas backgroundColor={darkTheme.background}>
  <LiveLineChart
    data={data}
    color={darkTheme.chartColors[0]}
  />
</ChartCanvas>
```

## ⚡ Performance Philosophy

DynamicGL is designed for performance:

- **Zero per-frame allocations** - Reuses buffers and geometry
- **Fixed-size ring buffers** - Predictable memory usage
- **GPU-friendly updates** - Only updates buffer attributes when needed
- **No object recreation** - Geometry is created once and reused
- **Efficient scaling** - Optimized coordinate transforms

## 🧱 Rendering Model

### Ownership Rules

The framework owns:
- Canvas
- Renderer
- Scene
- Camera
- Render loop

Charts never:
- Create canvases
- Create renderers
- Access the DOM

### Chart Host Component

```tsx
<ChartCanvas>
  <LiveLineChart />
</ChartCanvas>
```

`ChartCanvas` must:
- Use `@react-three/fiber`
- Handle resize
- Provide a shared coordinate space

## 📊 Data Model

Initial data model:

```typescript
type LiveDataPoint = {
  x: number; // time or index
  y: number; // value
};
```

Future extensions:
- Multiple series
- Typed streams
- Binary buffers

## 🗺️ Roadmap

### Phase 1 – Infrastructure ✅
- [x] Setup pnpm monorepo
- [x] Create docs site (Next.js)
- [x] Setup core/charts/react packages
- [x] Render empty Three.js grid

### Phase 2 – Core Engine ✅
- [x] Scaling utilities
- [x] Axes
- [x] Grid helpers
- [x] Coordinate transforms

### Phase 3 – First Chart ✅
- [x] Live line chart
- [x] Ring buffer implementation
- [x] GPU-friendly updates
- [x] No object recreation per frame

### Phase 4 – Public API ✅
- [x] Stable React components
- [x] Type-safe props
- [x] Clear examples

### Phase 5 – Future Enhancements
- [ ] Additional chart types (bar, area, scatter)
- [ ] Multiple series support
- [ ] Interactive features (zoom, pan)
- [ ] Playground with JSON config
- [ ] Performance monitoring tools

## 🧪 Quality & Performance Rules

- ✅ TypeScript everywhere
- ✅ No global state
- ✅ No memory leaks
- ✅ No per-frame allocations
- ✅ No unnecessary re-renders
- ✅ Clear documentation

## 🚀 Publishing & Deployment

### Publishing to NPM

1. **Setup NPM token:**
   - Create an npm access token at https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Add it as `NPM_TOKEN` in GitHub Secrets

2. **Publish via GitHub Actions:**
   - Create a new GitHub Release
   - The `publish.yml` workflow will automatically publish all packages

3. **Or publish manually:**
   ```bash
   pnpm publish:packages
   ```

### Deploying Documentation

The documentation site can be deployed to Vercel, Netlify, or any static hosting service.

**Vercel (Recommended):**
1. Install Vercel CLI: `npm i -g vercel`
2. Add Vercel tokens to GitHub Secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Push to main branch → Auto-deploys via GitHub Actions

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Documentation

For more detailed documentation, examples, and API reference, visit the [docs site](./apps/docs-site) or run:

```bash
pnpm dev
```

Then open http://localhost:3000 in your browser.

---

**Built with ❤️ for real-time data visualization**
