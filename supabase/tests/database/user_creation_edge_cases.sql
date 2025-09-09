-- User Creation Edge Cases Test with pgTAP and Test Helpers
-- This test verifies edge cases for user creation and profile/settings insertion

-- Plan the number of tests
SELECT plan(3);

-- Begin transaction to ensure test isolation
BEGIN;

-- Test 1: Create user with email but no full_name (should derive from email)
SELECT tests.create_supabase_user('edgecase_user', 'edgecase1@example.com');

-- Test 2: Verify user was created
SELECT ok(
    EXISTS(SELECT 1 FROM auth.users WHERE id = tests.get_supabase_uid('edgecase_user')),
    'User should be created in auth.users'
);

-- Test 3: Verify profile was created with derived full_name
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_profiles WHERE user_id = tests.get_supabase_uid('edgecase_user') AND full_name = 'edgecase1'),
    'User profile should have derived full_name from email'
);

-- Test 4: Verify settings were created with defaults
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_settings WHERE user_id = tests.get_supabase_uid('edgecase_user') AND theme = 'system' AND language = 'en' AND notifications_enabled = true),
    'User settings should have correct default values'
);

-- Finish the tests
SELECT * FROM finish();

-- Rollback the transaction to keep the database clean
ROLLBACK;
