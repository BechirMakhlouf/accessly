# Agent Guidelines for Accessly

## Build/Lint/Test Commands
- `pnpm run build` - Build all workspaces
- `pnpm run lint` - Lint all workspaces
- `pnpm run lint:fix` - Auto-fix linting issues
- `pnpm run type-check` - TypeScript type checking
- `pnpm run ci:full` - Run all CI checks (lint + type-check + build)
- `pnpm run test:db` - Run Supabase database tests
- `pnpm run web:test` - Run web app tests (add `-- path/to/test.ts` for single test)
- `pnpm run supabase:types:local` - Generate DB types after schema changes

## Code Style
- **No comments** unless explicitly requested
- **TypeScript**: Never use explicit or implicit `any` - always provide proper types
- **Imports**: Group by external, workspace, internal; use absolute paths from `@/` for web app
- **Formatting**: Auto-formatted via Prettier (shared config from `@accessly/config`)
- **Naming**: camelCase for variables/functions, PascalCase for components/types, kebab-case for files
- **Environment Variables**: Must be registered in `src/lib/env.ts` (never access `process.env` directly)
- **Routes**: Define in `src/lib/routes.ts`, reference via `getFullRoute()` utility
- **i18n**: All user-facing text must use i18n keys from `messages/*.json` files
- **Components**: Use shadcn UI components; prefer semantic tokens (`bg-primary`) over hardcoded colors (`bg-green-500`)
- **State**: Use TanStack Query for server state (encapsulated in hooks), Zustand only for complex client state
- **DB Changes**: All changes must have migration files in `supabase/migrations/` and schema files in `supabase/schemas/`
- **Error Handling**: Return proper HTTP status codes; log server errors with stack traces; show user-friendly messages to clients
