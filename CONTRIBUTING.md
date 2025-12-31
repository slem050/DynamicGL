# Contributing to DynamicGL

Thank you for your interest in contributing to DynamicGL! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/slem050/DynamicGL.git
   cd DynamicGL
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build all packages**
   ```bash
   pnpm build
   ```

4. **Start the docs site**
   ```bash
   pnpm dev
   ```

## Project Structure

```
dynamicgl/
├── apps/
│   └── docs-site/          # Next.js documentation site
├── packages/
│   ├── core/               # Core engine (no React)
│   ├── charts/             # Chart implementations
│   ├── react/              # React components
│   └── theme/              # Theming and styling
├── pnpm-workspace.yaml     # pnpm workspace config
└── package.json            # Root package.json
```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow TypeScript best practices
   - Write clear, documented code
   - Ensure no per-frame allocations
   - Test your changes

3. **Build and test**
   ```bash
   pnpm build
   pnpm typecheck
   ```

4. **Run the docs site to test**
   ```bash
   pnpm dev
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: your feature description"
   ```

6. **Push and create a Pull Request**

## Code Style

- Use TypeScript for all code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Performance Guidelines

- **No per-frame allocations** - Reuse buffers and objects
- **Fixed-size buffers** - Use ring buffers for streaming data
- **GPU-friendly updates** - Only update when data changes
- **No unnecessary re-renders** - Optimize React components

## Package Guidelines

### Core Package
- Pure TypeScript, no React
- No DOM access
- Focus on math, scaling, and utilities

### Charts Package
- No React dependencies
- No renderer ownership
- GPU-optimized geometry

### React Package
- Public API only
- Type-safe props
- Clear component interfaces

## Testing

While we don't have a formal test suite yet, please test your changes:

1. Build all packages
2. Run the docs site
3. Test your changes in the browser
4. Check for console errors
5. Verify performance (no memory leaks, smooth rendering)

## Questions?

Feel free to open an issue for questions or discussions!

