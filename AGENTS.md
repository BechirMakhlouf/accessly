# Coding Guidelines

This document outlines the coding standards and best practices for the Accessly project. Adhering to these guidelines will help keep the codebase consistent, maintainable, and scalable.

---

## 1. Modules Pattern (Strong Encapsulation)

- **Encapsulate all feature logic:**
  - Each feature has its own folder under `src/modules/[feature-name]`.
  - The module folder contains:
    - UI components unique to this feature
    - Hooks (`useX`) specific to the feature
    - State management: implemented in a `store.ts` file using Zustand, scoped to the feature
    - Actions, async logic, API calls, Supabase queries, and helpers
    - Types used exclusively or primarily by this feature
- **No feature leakage:**
  - Do **not** place components, hooks, or logic from one feature in another feature’s directory.
  - Import feature-specific code from outside the feature folder **only** via that feature’s public API (e.g., an `index.ts`).
- **Shared code:**
  - Generic UI elements go in `src/components/`.
  - Generic utilities go in `src/lib/`.

## 2. Internationalization (i18n)

- **i18n required in all UI components:**
  - All user-facing text **must** use the i18n utilities in `src/lib/i18n`.
  - No hardcoded strings in components; register strings in the appropriate JSON message files under `messages/`.
  - Organize feature-specific strings logically (e.g., use namespaces or grouped keys).

- **Approaches per route context:**
  - **Route-based localization** (public, marketing, auth):
    - Locale is part of the URL (e.g., `/en/sign-in`).
    - Pages and layouts live under `src/app/(public)/[locale]` or `src/app/(auth)/[locale]`.
    - Use Next.js dynamic route segments for locale-specific routes.
  - **Settings-based localization** (protected routes):
    - Locale preference is managed via user settings and stored in the user profile.
    - Protected routes do not include locale in the URL.
    - Use the i18n provider to apply locale from user settings instead of the URL.
    - Ensure fallback to default locale if user preference is missing.

## 3. Supabase Usage & Database Changes

- **Supabase code location:**
  - Feature-specific queries live in that modules’s folder (actions/hooks).
  - Generic Supabase utilities live in `src/lib/supabase/`.
  - Avoid using the client-side Supabase client inside React components. Perform Supabase calls on the server (API routes, Next.js server actions, or middleware) and expose necessary data via your own endpoints or loaders. Only use the client-side client for real-time subscriptions when required.
- **Supabase keys:**
  - Never expose service role or secret keys on the client. Use environment variables.
- **Strict Migration Policy:**
  - Every database change (tables, columns, buckets, indexes, enums, etc.) **must** be represented by a SQL migration file in `supabase/migrations/`.
  - Do **not** manually modify the database via the UI or CLI without creating a matching migration.
  - Name migrations descriptively (e.g., `20250717121500_add_profile_table.sql`).

## 4. Environment Variables

- **Type-safe access:**
  - Register all environment variables in `src/lib/env.ts`.
  - Access them exclusively through this module, never via `process.env` directly.
  - The `env.ts` module should validate variables at build time, failing the build if a required variable is missing or invalid.
  - Maintain a sample `.env.example` file documenting required variables and their types.

## 5. Routing

- **Centralized Route Management:**
  - Declare all routes in `src/lib/routes.ts`.
  - When adding a new page or API route, update `routes.ts` with its canonical path.
  - Reference routes throughout the application **only** via the `getFullRoute` utility.
  - Avoid hardcoding route strings to ensure consistency and type safety.
  - All API route handlers must reside under `/src/app/api/`. Do not define API routes outside this directory.
  
## 6. UI Components & Styling

- Use shadcn UI components wherever possible instead of building custom components from scratch.
- When specifying colors:
  - Avoid Tailwind color utilities with hard-coded scales (e.g., `bg-green-500`, `text-red-600`).
  - Prefer semantic token classes provided by the shadcn configuration (e.g., `bg-primary`, `text-destructive`, `border-muted`).
  - In CSS-in-JS or stylesheets, reference CSS variables (e.g., `var(--primary)`, `var(--destructive)`) instead of literal values.

## 7. Validation & Data Fetching

- **Schema validation:** Use Zod for defining and parsing schemas (e.g., API payloads, config objects). Place shared schemas in `src/lib/schemas` or within modules folders.
- **Form validation:** Use React Hook Form for building and validating forms. Integrate with Zod via `@hookform/resolvers/zod` to enforce schema rules.
- **Client-side data fetching:** Leverage TanStack Query for API calls, caching, and mutations. Always use the shared `queryClient` and prefetch data when possible (e.g., via `prefetchQuery` or `useQuery` in page loaders).
  
## 8. Error Handling

- **HTTP status codes:** Return appropriate status codes (4xx for client errors, 5xx for server errors) and avoid using generic 200 responses for errors.
- **Server-side logging:** Log unexpected errors with full stack traces. Avoid logging sensitive data.
- **Secure error messages:** Expose only user-friendly messages to clients. Do not leak stack traces or internal implementation details.
- **Client-side handling:** Catch and handle errors in UI components. Display clear, actionable feedback to users. Differentiate between validation, network, and server errors.

---

## 9. Page Loading States

- **Page-level loading components:** Each page directory under `src/app` **must** include a `loading.tsx` file exporting a React component to display during page-level loading states (e.g., skeletons or spinners). Use consistent UI patterns and register any necessary i18n strings.

## 10. Scripts

- **Scripts in package.json:** All project scripts (dev, build, lint, migrate, etc.) must be declared in the "scripts" section of `package.json`.
- **Cross-platform compatibility:** Scripts should work on Windows, macOS, and Linux. Use Node.js-based tools or utilities like `cross-env` and avoid shell-specific syntax.

## 11. Packages used

- Next.js
- TypeScript
- Tailwind CSS
- class-variance-authority (CVA) & clsx
- tailwind-merge
- Lucide-React
- supabase-js & @supabase/ssr
- next-intl
- next-themes
- @t3-oss/env-nextjs
- react-hook-form & @hookform/resolvers
- Zod
- @tanstack/react-query (& devtools)
- Zustand
- botid
- shx & jiti

## 12. Directory Structure

- messages/
JSON files for i18n message catalogs, one file per locale (en.json, de.json, fr.json, …).

- public/
Static assets (SVGs, images, favicon) served from the web root.

- src/
All application source code, split into these sub-folders:

  - app/
  Next.js App Router entrypoint.
  • (public)/[locale]/… – Public and marketing pages using route-based locale segments.
  • (protected)/… – Authenticated pages (locale from user settings).
  • api/… – Server-side Route handlers (Next API routes).
  • layout.tsx, globals.css, etc. – Root and shared layouts/styles.

  - components/
  Reusable UI components and wrappers:
  • ui/ – Generic building blocks (Button, Input, Card, etc.).
  • icons/ – Project-specific SVG icons.
  • Other shared pieces (Header, ThemeToggle, etc.).

  - lib/
  Cross-feature utilities and configuration:
  • i18n/ – next-intl setup (middleware, utils, routing, formats).
  • supabase/ – Supabase client, server helpers, real-time middleware.
  • env.ts – Type-safe environment variables.
  • routes.ts – Centralized route definitions.
  • query-client.tsx – React Query client setup.
  • utils.ts – Miscellaneous helpers.

  - modules/
  Self-contained feature folders (strong encapsulation).
  Each module (e.g. feature1/, chatbot/, comments/) contains its own:
  • UI components
  • Hooks & actions
  • Zustand store
  • API calls / helpers
  • Feature-specific types

  - providers/
  React context providers (Theme, Auth, i18n, etc.) composed at the app root.

  - types/
  Shared or generated TypeScript types (e.g. database schema types).

  middleware.ts
  Next.js edge middleware (locale redirects, auth guards, etc.).

- supabase/
Local Supabase project configuration:
• migrations/ – SQL migration files (strict migration policy).
• schemas/ – Optional SQL schema exports.
• config.toml, .env – Supabase CLI settings and secrets.

- Configuration & Scripts
• .env.example, .env.local – Environment variable templates and overrides.
• Dockerfile – Container build definition.
• eslint.config.mjs, postcss.config.mjs, next.config.js, tsconfig.json – Tooling configs.
• package.json, pnpm-lock.yaml – Scripts, dependencies, and lockfile.

## 13. Preference

- Prefer Server Actions over API routes for data fetching and mutations. Use routes only when necessary (where server actions aren't suitable).
- Prefer Zustand for state management over React Context. Use Zustand stores scoped to each feature module.
- Prefer SupabaseSSR Over accessing Supabase directly in client components.
