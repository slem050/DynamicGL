# Nx Projects Explained

## Are They Auto-Generated?

**No!** These projects were **manually created** by adding `project.json` files to your existing packages. Nx didn't generate them - I configured them based on your existing structure.

## The 5 Projects Breakdown

### 📦 Library Packages (Graph/Chart Libraries) - 4 projects

These are the **graph/chart libraries** that can be published to npm:

1. **`core`** - Core engine
   - Type: `library`
   - Location: `packages/core/`
   - Purpose: Core utilities (scaling, buffers, time windows)
   - Publishable: Yes → `@dynamicgl/core`

2. **`charts`** - Chart implementations
   - Type: `library`
   - Location: `packages/charts/`
   - Purpose: Chart geometry and GPU buffers
   - Publishable: Yes → `@dynamicgl/charts`

3. **`theme`** - Theming
   - Type: `library`
   - Location: `packages/theme/`
   - Purpose: Colors, presets, styling
   - Publishable: Yes → `@dynamicgl/theme`

4. **`react`** - React components
   - Type: `library`
   - Location: `packages/react/`
   - Purpose: React components and hooks
   - Publishable: Yes → `@dynamicgl/react`

### 🌐 Website (Application) - 1 project

5. **`docs-site`** - Documentation website
   - Type: `application`
   - Location: `apps/docs-site/`
   - Purpose: Documentation and examples
   - Publishable: No (it's a website, not a package)

## Summary

| Project | Type | Purpose | Publishable |
|---------|------|---------|-------------|
| `core` | Library | Graph library (core) | ✅ Yes |
| `charts` | Library | Graph library (charts) | ✅ Yes |
| `theme` | Library | Graph library (theme) | ✅ Yes |
| `react` | Library | Graph library (React) | ✅ Yes |
| `docs-site` | Application | Website | ❌ No |

## How They Were Created

1. **Your existing structure** (before Nx):
   - You already had `packages/core/`, `packages/charts/`, etc.
   - You already had `apps/docs-site/`

2. **I added Nx configuration**:
   - Created `project.json` files for each
   - Added `nx.json` for workspace config
   - Configured build targets

3. **Result**:
   - Nx now recognizes your existing projects
   - Can run commands like `nx run core:build`
   - Can see dependency graph

## What "Default" Means

There are no "default" projects - they're all your custom projects:
- **4 library projects** = Your graph/chart libraries
- **1 application project** = Your documentation website

None are auto-generated - they're all based on your existing code structure!

