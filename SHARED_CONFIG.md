# Shared Configuration Setup

This document outlines the shared TypeScript, ESLint, and Prettier configurations across the Accessly Turborepo monorepo.

## Packages Created

### `@accessly/typescript-config`
- **Base configuration** (`base.json`): Strict TypeScript settings with modern ES2022 target
- **Next.js configuration** (`next.json`): Extends base with Next.js specific settings
- **Node.js configuration** (`node.json`): Extends base with Node.js specific settings

### `@accessly/eslint-config`
- **Base configuration** (`index.js`): Core ESLint rules with TypeScript, React, and import plugins
- **Next.js configuration** (`next.js`): Extends base with Next.js specific rules
- **Node.js configuration** (`node.js`): Extends base with Node.js specific rules

### `@accessly/prettier-config`
- **Shared configuration** (`index.js`): Consistent formatting rules across all packages

## Workspace Configurations

### Root Level
- `tsconfig.json`: Extends `@accessly/typescript-config/base`
- `eslint.config.js`: Uses `@accessly/eslint-config`
- `.prettierrc.js`: Uses `@accessly/prettier-config`

### Web App (`apps/web`)
- `tsconfig.json`: Extends `@accessly/typescript-config/next`
- `eslint.config.js`: Uses `@accessly/eslint-config/next`
- `.prettierrc.js`: Uses `@accessly/prettier-config`

### Service App (`apps/service`)
- `tsconfig.json`: Extends `@accessly/typescript-config/node` with Hono JSX settings
- `eslint.config.js`: Uses `@accessly/eslint-config/node`
- `.prettierrc.js`: Uses `@accessly/prettier-config`

## Available Scripts

### Root Level
- `pnpm lint`: Run linting across all workspaces
- `pnpm lint:fix`: Run linting with auto-fix across all workspaces
- `pnpm type-check`: Run TypeScript type checking across all workspaces
- `pnpm format`: Format code across all workspaces
- `pnpm format:check`: Check formatting across all workspaces
- `pnpm lint:root`: Lint root-level files
- `pnpm lint:root:fix`: Lint root-level files with auto-fix
- `pnpm format:root`: Format root-level files
- `pnpm format:root:check`: Check formatting for root-level files

### Workspace Level
Each workspace has its own lint, lint:fix, type-check, format, and format:check scripts.

## Key Features

1. **Consistent Rules**: All workspaces use the same core rules with environment-specific extensions
2. **Type Safety**: Strict TypeScript configuration with no implicit any
3. **Modern Standards**: ES2022 target with latest language features
4. **Import Organization**: Automatic import sorting and deduplication
5. **React Best Practices**: Proper React and React Hooks rules
6. **Accessibility**: JSX accessibility rules included
7. **Formatting**: Consistent code formatting with Prettier

## Usage

The configurations are automatically applied when you run the respective commands. No additional setup is required beyond installing dependencies with `pnpm install`.
