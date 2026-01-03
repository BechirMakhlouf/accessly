# UI Migration Plan

## Overview

This document outlines the migration strategy for UI components in the Accessly monorepo.

## Current State

### `apps/web`

- 28 shadcn UI components in `src/components/ui/`
- 8 animate-ui components (with Framer Motion) in `src/components/animate-ui/`
- Tailwind CSS v4 with OKLCH colors in `globals.css`
- React 19.2.0, Next.js 16.0.10, shadcn `new-york` style

### `packages/ui`

- To be created as shared UI package

## Migration Tracks

### Track A: `apps/web` Radix Consolidation ✅ COMPLETED

**Goal**: Migrate from 15 individual `@radix-ui/react-*` packages to the unified `radix-ui` package.

**Status**: Done

**Changes made**:

- Updated all 20 UI component imports from `@radix-ui/react-*` to `radix-ui`
- Changed `Slot` usage to `SlotPrimitive.Slot` pattern (namespace export)
- Removed 15 individual `@radix-ui/react-*` packages from `apps/web/package.json`
- Kept `radix-ui` v1.4.3 (unified package)
- TypeScript typecheck passes

**Import pattern used**:

```tsx
// Primitives (Dialog, Select, etc.)
import { Dialog as DialogPrimitive } from "radix-ui";

// Slot (special case - namespace export)
import { Slot as SlotPrimitive } from "radix-ui";
const Comp = asChild ? SlotPrimitive.Slot : "button";
```

### Track B: `packages/ui` Shared Component Library

**Goal**: Create a shared UI package (shadcn-style) for cross-app component reuse.

**Status**: In Progress

**Rationale**:

- Use shadcn/ui component templates and patterns
- Keep styling consistent with `apps/web` (`new-york`, Tailwind v4, CSS variables)
- Shareable across future apps in the monorepo

**Structure**:

```
packages/ui/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # Main exports
│   ├── utils/
│   │   ├── cn.ts             # Class merge utility
│   │   └── index.ts
│   └── components/
│       ├── button/
│       │   ├── button.tsx
│       │   └── index.ts
│       ├── input/
│       │   ├── input.tsx
│       │   └── index.ts
│       └── ... (other components)
```

**Dependencies**:

- `radix-ui` (or `@radix-ui/react-*`) - Accessible primitives
- `class-variance-authority` - Variant styling (cva)
- `tailwind-merge` - Intelligent class merging
- `clsx` - Class composition
- `tw-animate-css` - Animation utilities used by shadcn
- `lucide-react` - Icons (shadcn default)

**Peer Dependencies** (provided by consuming apps):

- `react` ^19.0.0
- `react-dom` ^19.0.0

**Package exports**:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./utils": "./src/utils/index.ts",
    "./components/*": "./src/components/*/index.ts"
  }
}
```

**Steps**:

1. ✅ Define package structure and dependencies
2. ⏳ Create `packages/ui/package.json` and `tsconfig.json`
3. ⏳ Set up utilities (`cn` function)
4. ⏳ Create initial Button component (shadcn-style)
5. ⏳ Export package and verify type-check passes
6. ⏳ Test import from `apps/web`

### Track C: Future - Migrate `apps/web` to `@accessly/ui`

**Goal**: Gradually replace `apps/web` shadcn components with `@accessly/ui` equivalents.

**Status**: Not Started (depends on Track B completion)

**Approach**:

1. Start with simple components (Button, Input)
2. Create equivalent styled versions in `@accessly/ui`
3. Update imports in `apps/web` one component at a time
4. Keep shadcn components as fallback during transition
5. Remove shadcn components once fully migrated

## Design Decisions

1. **Preserve existing theming**: Keep `globals.css` OKLCH color variables unchanged
2. **Keep animate-ui app-specific**: Animation components stay in `apps/web`
3. **Independent tracks**: Web app consolidation and packages/ui are independent
4. **No build step for packages/ui**: Use TypeScript source directly (like `@accessly/core`)
5. **shadcn patterns**: Use shadcn/ui conventions and component structure

## Notes

- `radix-ui` unified package exports primitives as namespaces (e.g., `Dialog`, `Slot`)
- `Slot` specifically exports `Slot.Root` and `Slot.Slot` - use `SlotPrimitive.Slot` pattern
- If using `radix-ui` (unified), follow the namespace import pattern used in Track A
