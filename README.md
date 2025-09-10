# Accessly

A modern web application built with Next.js, TypeScript, and Supabase.

## Prerequisites

Before you can start working on this project, make sure you have the following installed on your machine:

- **Node.js 22 or higher** - [Download here](https://nodejs.org/)
- **Docker** - [Download here](https://www.docker.com/products/docker-desktop/)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd accessly
```

### 2. Initialize Local Environment

Run the following command to set up your local environment:

```bash
npm run init-local
```

This command will:
- Install all project dependencies
- Copy environment variables from `env.example` to `.env.local`

### 3. Start the Development Server

Once the initialization is complete, start the development server:

```bash
npm run dev
```

This command will:
- Start the Supabase local development environment (requires Docker)
- Start the Next.js development server with Turbopack

The application will be available at `http://localhost:3000`.

## Project Structure

This project follows a modular architecture with strong encapsulation:

- `src/modules/` - Feature-specific modules with their own components, hooks, stores, and types
- `src/components/` - Reusable UI components
- `src/lib/` - Shared utilities and configuration
- `src/app/` - Next.js App Router pages and layouts
- `supabase/` - Database schemas, migrations, and Supabase configuration

## Available Scripts

### Development
- `npm run dev` - Start development server with Supabase
- `npm run devs` - Start development server with HTTPS
- `npm run init-local` - Initialize local environment

### Supabase
- `npm run supabase:start` - Start Supabase local development
- `npm run supabase:stop` - Stop Supabase local development
- `npm run supabase:restart` - Restart Supabase local development
- `npm run supabase:db:reset` - Reset the local database

### Database Management
- `npm run supabase:types:local` - Generate TypeScript types from local database
- `npm run supabase:db:gen-migration` - Generate a new migration
- `npm run validate:migrations` - Validate migration files
- `npm run validate:db-types` - Validate database types

### Testing
- `npm run test:db` - Run database tests
- `npm run create-test-users` - Create test users (this is a utility to create simple users for debugging)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Internationalization**: next-intl
- **Query Management**: TanStack Query

## Development Guidelines

This project follows strict coding guidelines:

- **Modular Architecture**: Each feature is encapsulated in its own module
- **Type Safety**: No explicit or implicit `any` types
- **Internationalization**: All user-facing text must use i18n keys
- **Database Changes**: All database changes must be represented in migration files
- **Environment Variables**: All environment variables must be registered in `src/lib/env.ts`

## Troubleshooting

### Docker Issues
If you encounter Docker-related issues:
- Ensure Docker Desktop is running
- Check that Docker has sufficient resources allocated
- Try restarting Docker Desktop

### Supabase Issues
If Supabase fails to start:
- Run `npm run supabase:stop` to stop any running instances
- Run `npm run supabase:start` to restart
- Check Docker logs for any error messages

### Port Conflicts
If port 3000 is already in use:
- The Next.js dev server will automatically use the next available port
- Check the terminal output for the actual port being used

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the project's coding guidelines
3. Run `npm run ci:full` to ensure all checks pass
4. Submit a pull request

## Support

If you encounter any issues or have questions, please reach out to the development team or create an issue in the repository.