# Database Tests

This directory contains pgTAP-based tests for the Supabase database schema and RLS policies.

## Prerequisites

- Docker Desktop installed and running
- Supabase CLI installed
- Local Supabase development environment

## Running Tests

### Start Local Supabase Environment

```bash
# Start Supabase local development environment
npx supabase start

# Or if you have Supabase CLI installed globally
supabase start
```

### Run All Database Tests

```bash
# Run all database tests
npm run test:db

# Or directly with Supabase CLI
npx supabase test db
```

### Run Specific Test Files

```bash
# Run specific test file
npx supabase test db tests/database/boards_rls_policies.sql
```

## Test Files

- `000-setup-test-helpers.sql` - Sets up pgTAP and test helper functions
- `user_creation.sql` - Tests user creation and profile/settings triggers
- `user_creation_edge_cases.sql` - Tests edge cases for user creation
- `boards_rls_policies.sql` - Comprehensive RLS policy tests for boards module

## Test Structure

Each test file follows this pattern:

1. **Plan**: Declare the number of tests with `SELECT plan(N);`
2. **Setup**: Create test data using helper functions
3. **Tests**: Use pgTAP functions like `ok()`, `is()`, `throws_ok()`
4. **Cleanup**: Use `ROLLBACK` to keep database clean
5. **Finish**: Call `SELECT * FROM finish();`

## Test Helpers

The test helpers provide these functions:

- `tests.create_supabase_user(identifier, email, phone, metadata)` - Create test users
- `tests.get_supabase_uid(identifier)` - Get user UUID by identifier
- `tests.authenticate_as(identifier)` - Authenticate as a test user
- `tests.authenticate_as_service_role()` - Authenticate as service role
- `tests.clear_authentication()` - Clear authentication context
- `tests.rls_enabled(schema, table)` - Check if RLS is enabled

## Example Test

```sql
-- Plan the number of tests
SELECT plan(3);

-- Begin transaction for test isolation
BEGIN;

-- Create test user
SELECT tests.create_supabase_user('test_user', 'test@example.com');

-- Test user creation
SELECT ok(
    EXISTS(SELECT 1 FROM auth.users WHERE id = tests.get_supabase_uid('test_user')),
    'User should be created in auth.users'
);

-- Finish tests
SELECT * FROM finish();
ROLLBACK;
```

## Troubleshooting

### Docker Issues

If you get Docker-related errors:

1. Ensure Docker Desktop is installed and running
2. Check Docker daemon status: `docker info`
3. Restart Docker Desktop if needed

### Supabase CLI Issues

If Supabase CLI is not found:

1. Install globally: `npm install -g supabase`
2. Or use npx: `npx supabase`
3. Or install via package manager (see [Supabase CLI docs](https://github.com/supabase/cli#install-the-cli))

### Test Failures

1. Check that all migrations are applied: `npx supabase db reset`
2. Verify test helper functions are loaded
3. Check that RLS policies are properly defined
4. Review test data setup and cleanup