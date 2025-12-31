# React Package Structure

## Organized File Structure

```
packages/react/src/
├── components/              # React components
│   ├── canvas/             # Canvas/container components
│   │   ├── ChartCanvas.tsx
│   │   └── index.ts
│   ├── charts/             # Chart components
│   │   ├── LiveLineChart.tsx
│   │   └── index.ts
│   ├── axes/               # Axis components
│   │   ├── BasicAxes.tsx
│   │   ├── SimpleAxes.tsx
│   │   ├── AxisLabels.tsx
│   │   └── index.ts
│   ├── display/            # Display/UI components
│   │   ├── ValueDisplay.tsx
│   │   └── index.ts
│   └── index.ts            # Component barrel export
│
├── hooks/                  # React hooks
│   └── index.ts            # useMockStream, useLiveData
│
├── types/                  # TypeScript types and interfaces
│   ├── types.ts            # Component prop types
│   ├── interfaces.ts       # Configuration interfaces
│   └── index.ts            # Type barrel export
│
├── __tests__/              # Test utilities (internal)
│   └── TestLine.tsx
│
└── index.ts                # Public API exports
```

## Component Organization

### Canvas Components (`components/canvas/`)
- **ChartCanvas**: Main container component for charts

### Chart Components (`components/charts/`)
- **LiveLineChart**: Live streaming line chart component

### Axis Components (`components/axes/`)
- **BasicAxes**: Basic axis and grid rendering
- **SimpleAxes**: Simplified axis rendering
- **AxisLabels**: Axis label rendering

### Display Components (`components/display/`)
- **ValueDisplay**: X/Y value display tooltip

## Hooks (`hooks/`)
- **useMockStream**: Generate mock streaming data
- **useLiveData**: Manage live data stream

## Types (`types/`)
- **types.ts**: Component prop types (ChartCanvasProps, LiveLineChartProps)
- **interfaces.ts**: Configuration interfaces (BaseChartConfig, LineChartStyling, etc.)

## Benefits of This Structure

1. **Clear Organization**: Components grouped by purpose
2. **Easy to Navigate**: Find components quickly
3. **Scalable**: Easy to add new chart types, axes, etc.
4. **Clean Imports**: Barrel exports make imports simple
5. **Maintainable**: Related code is grouped together

## Adding New Components

### New Chart Type
```
components/charts/
  └── BarChart.tsx
```

### New Axis Type
```
components/axes/
  └── CustomAxes.tsx
```

### New Hook
```
hooks/
  └── useCustomData.ts
```

All exports are automatically available through the main `index.ts`!

