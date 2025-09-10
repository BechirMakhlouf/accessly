---
alwaysApply: true
---

# Coding Guidelines

This document outlines the coding standards and best practices for the Accessly project. Adhering to these guidelines will help keep the codebase consistent, maintainable, and scalable.

---

## 📁 1. Modules Pattern (Strong Encapsulation)

### Encapsulate all feature logic
- Each feature has its own folder under `src/modules/[feature-name]`
- The module folder contains:
  - UI components unique to this feature
  - Hooks (`useX`) specific to the feature that encapsulate TanStack Query logic
  - State management: TanStack Query for server state, Zustand store (`store.ts`) for complex client state when needed
  - Actions, async logic, API calls, Supabase queries, and helpers
  - Types used exclusively or primarily by this feature

### No feature leakage
- Do **not** place components, hooks, or logic from one feature in another feature's directory
- Import feature-specific code from outside the feature folder **only** via that feature's public API (e.g., an `index.ts`)

### Shared code
- Generic UI elements go in `src/components/`
- Generic utilities go in `src/lib/`

---

## 🌐 2. Internationalization (i18n)

### i18n required in all UI components
- All user-facing text **must** use the i18n utilities in `src/lib/i18n`
- No hardcoded strings in components; register strings in the appropriate JSON message files under `messages/`
- Organize feature-specific strings logically (e.g., use namespaces or grouped keys)

### Approaches per route context

#### Route-based localization (public, marketing, auth)
- Locale is part of the URL (e.g., `/en/sign-in`)
- Pages and layouts live under `src/app/(public)/[locale]` or `src/app/(auth)/[locale]`
- Use Next.js dynamic route segments for locale-specific routes

#### Settings-based localization (protected routes)
- Locale preference is managed via user settings and stored in the user profile
- Protected routes do not include locale in the URL
- Use the i18n provider to apply locale from user settings instead of the URL
- Ensure fallback to default locale if user preference is missing

---

## 🗄️ 3. Supabase Usage & Database Changes

### Supabase code location
- Feature-specific queries live in that module's folder (actions/hooks)
- Generic Supabase utilities live in `src/lib/supabase/`
- Avoid using the client-side Supabase client inside React components. Perform Supabase calls on the server (API routes, Next.js server actions, or middleware) and expose necessary data via your own endpoints or loaders. Only use the client-side client for real-time subscriptions when required

### Supabase keys
- Never expose service role or secret keys on the client. Use environment variables

### Strict DB Schema Policy
- Every database change (tables, columns, buckets, indexes, enums, etc.) **must** be represented in a `supabase/schema` folder
- Do **not** manually modify the database via the UI or CLI without creating a matching schema change

---

## 🔧 4. Environment Variables

### Type-safe access
- Register all environment variables in `src/lib/env.ts`
- Access them exclusively through this module, never via `process.env` directly
- The `env.ts` module should validate variables at build time, failing the build if a required variable is missing or invalid
- Maintain a sample `.env.example` file documenting required variables and their types

---

## 🛣️ 5. Routing

### Centralized Route Management
- Declare all routes in `src/lib/routes.ts`
- When adding a new page or API route, update `routes.ts` with its canonical path
- Reference routes throughout the application **only** via the `getFullRoute` utility
- Avoid hardcoding route strings to ensure consistency and type safety
- All API route handlers must reside under `/src/app/api/`. Do not define API routes outside this directory

---

## 🎨 6. UI Components & Styling

### Component Guidelines
- Use shadcn UI components wherever possible instead of building custom components from scratch

### Color Guidelines
When specifying colors:
- Avoid Tailwind color utilities with hard-coded scales (e.g., `bg-green-500`, `text-red-600`)
- Prefer semantic token classes provided by the shadcn configuration (e.g., `bg-primary`, `text-destructive`, `border-muted`)
- In CSS-in-JS or stylesheets, reference CSS variables (e.g., `var(--primary)`, `var(--destructive)`) instead of literal values

---

## ✅ 7. Validation & Data Fetching

### Schema validation
- Use Zod for defining and parsing schemas (e.g., API payloads, config objects)
- Place shared schemas in `src/lib/schemas` or within modules folders

### Form validation
- Use React Hook Form for building and validating forms
- Integrate with Zod via `@hookform/resolvers/zod` to enforce schema rules

### Client-side data fetching
- Leverage TanStack Query for API calls, caching, and mutations
- Encapsulate TanStack Query logic in feature-specific hooks (e.g., `useUserProfile`, `useOrganizations`)
- Use TanStack Query as the primary state management solution for server state

---

## ⚠️ 8. Error Handling

### HTTP status codes
- Return appropriate status codes (4xx for client errors, 5xx for server errors) and avoid using generic 200 responses for errors

### Server-side logging
- Log unexpected errors with full stack traces
- Avoid logging sensitive data

### Secure error messages
- Expose only user-friendly messages to clients
- Do not leak stack traces or internal implementation details

### Client-side handling
- Catch and handle errors in UI components
- Display clear, actionable feedback to users
- Differentiate between validation, network, and server errors

---

## ⏳ 9. Page Loading States

### Page-level loading components
- Each page directory under `src/app` **must** include a `loading.tsx` file exporting a React component to display during page-level loading states (e.g., skeletons or spinners)
- Use consistent UI patterns and register any necessary i18n strings

---

## 📜 10. Scripts

### Scripts in package.json
- All project scripts (dev, build, lint, migrate, etc.) must be declared in the "scripts" section of `package.json`

### Cross-platform compatibility
- Scripts should work on Windows, macOS, and Linux
- Use Node.js-based tools or utilities like `cross-env` and avoid shell-specific syntax

---

## 📦 11. Tech Stack

### Core Technologies
- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### UI & Styling
- **class-variance-authority (CVA) & clsx** - Component variant management
- **tailwind-merge** - Tailwind class merging utility
- **Lucide-React** - Icon library
- **Radix UI** - Headless UI components

### Backend & Database
- **supabase-js & @supabase/ssr** - Backend-as-a-Service
- **@t3-oss/env-nextjs** - Environment variable validation

### State Management & Data Fetching
- **@tanstack/react-query (& devtools)** - Primary state management for server state
- **Zustand** - Complex client-side state management (when needed)
- **react-hook-form & @hookform/resolvers** - Form handling

### Internationalization & Theming
- **next-intl** - Internationalization
- **next-themes** - Theme management

### Validation & Utilities
- **Zod** - Schema validation
- **botid** - Bot detection

---

## 📂 12. Directory Structure

```
accessly/
├── messages/                    # i18n message catalogs
│   ├── en.json
│   ├── de.json
│   └── fr.json
├── public/                      # Static assets
│   ├── favicon.ico
│   └── *.svg
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (public)/[locale]/   # Public pages with locale
│   │   ├── (protected)/         # Authenticated pages
│   │   ├── api/                 # API routes
│   │   └── layout.tsx
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Generic building blocks
│   │   ├── icons/               # Project-specific icons
│   │   └── *.tsx                # Shared components
│   ├── lib/                     # Cross-feature utilities
│   │   ├── i18n/                # next-intl setup
│   │   ├── supabase/            # Supabase utilities
│   │   ├── env.ts               # Environment variables
│   │   ├── routes.ts            # Route definitions
│   │   └── utils.ts             # Miscellaneous helpers
│   ├── modules/                 # Feature modules (encapsulated)
│   │   └── [feature-name]/
│   │       ├── components/      # Feature-specific UI
│   │       ├── hooks/           # TanStack Query hooks (primary state)
│   │       ├── store.ts         # Zustand store (complex client state only)
│   │       ├── actions/         # API calls & logic
│   │       └── types.ts         # Feature-specific types
│   ├── providers/               # React context providers
│   ├── types/                   # Shared TypeScript types
│   └── middleware.ts            # Next.js middleware
├── supabase/                    # Supabase configuration
│   ├── migrations/              # SQL migration files
│   ├── schemas/                 # Schema exports
│   └── config.toml
└── Configuration files          # Tooling configs
    ├── .env.example
    ├── package.json
    └── *.config.*
```

---

## ⚡ 13. Development Preferences

### Architecture Preferences
- **Prefer Server Actions** over API routes for data fetching and mutations. Use routes only when necessary (where server actions aren't suitable)
- **Prefer TanStack Query** for state management, encapsulated in feature-specific hooks
- **Use Zustand** only for complex client-side state management when TanStack Query is insufficient
- **Prefer SupabaseSSR** over accessing Supabase directly in client components

### Type Safety
- **Never use explicit or implicit `any` types** - Always provide proper TypeScript types

---

## 🚀 Quick Reference

### Essential Commands
```bash
# Initialize local environment
npm run init-local

# Start development server
npm run dev

# Generate database types
npm run supabase:types:local

# Run all CI checks
npm run ci:full
```

### Key Files to Know
- `src/lib/env.ts` - Environment variable definitions
- `src/lib/routes.ts` - Centralized route management
- `src/types/database.types.ts` - Generated database types
- `messages/` - Internationalization strings
- `supabase/migrations/` - Database schema changes

---

*This document is living and should be updated as the project evolves. All team members are expected to follow these guidelines to maintain code quality and consistency.*