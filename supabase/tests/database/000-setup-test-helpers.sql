-- Setup Test Helpers for Supabase Testing via Basejump supabase-test-helpers
-- Docs: https://github.com/usebasejump/supabase-test-helpers

-- Ensure pgTAP is available
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

-- Install dbdev (extension/package manager)
CREATE EXTENSION IF NOT EXISTS dbdev WITH SCHEMA extensions;

-- Install Basejump supabase-test-helpers (idempotent)
SELECT dbdev.install('basejump-supabase_test_helpers');

-- Verify expected helper functions exist
BEGIN;
  SELECT plan(4);
  SELECT ok(EXISTS(SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'tests' AND p.proname = 'create_supabase_user'), 'tests.create_supabase_user exists');
  SELECT ok(EXISTS(SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'tests' AND p.proname = 'authenticate_as'), 'tests.authenticate_as exists');
  SELECT ok(EXISTS(SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'tests' AND p.proname = 'clear_authentication'), 'tests.clear_authentication exists');
  SELECT ok(EXISTS(SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'tests' AND p.proname = 'get_supabase_uid'), 'tests.get_supabase_uid exists');
  SELECT * FROM finish();
ROLLBACK;
