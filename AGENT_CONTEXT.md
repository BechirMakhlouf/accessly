# Agent Context

This repository is a flexible starter project intended to help small teams bootstrap applications quickly. It combines a Next.js frontend with a Supabase backend, providing authentication, database, and storage out of the box.

## Development Workflow

- **Local development:**
  - Run a local Supabase development server (database, auth, storage).
  - Run the Next.js development server (`pnpm dev`) to serve frontend pages and API routes.

- **Production deployment:**
  - nextjs app is deployed on Vercel.
  - Supabase backend (database, auth, storage) is deployed on Supabase's platform.
