-- User Creation Test with pgTAP and Test Helpers
-- This test verifies that when a user is created using test helpers,
-- corresponding rows are automatically created in public.user_profiles and public.user_settings

-- Plan the number of tests
SELECT plan(6);

-- Begin transaction to ensure test isolation
BEGIN;

-- Test 1: Create a test user using test helpers
SELECT tests.create_supabase_user('test_user', 'testuser@example.com');

-- Test 2: Verify user was created in auth.users
SELECT ok(
    EXISTS(SELECT 1 FROM auth.users WHERE id = tests.get_supabase_uid('test_user')),
    'User should be created in auth.users'
);

-- Test 3: Verify corresponding row exists in public.user_profiles
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_profiles WHERE user_id = tests.get_supabase_uid('test_user')),
    'A row should be added to public.user_profiles after user creation'
);

-- Test 4: Verify corresponding row exists in public.user_settings
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_settings WHERE user_id = tests.get_supabase_uid('test_user')),
    'A row should be added to public.user_settings after user creation'
);

-- Test 5: Verify user_profiles has correct email
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_profiles WHERE user_id = tests.get_supabase_uid('test_user') AND email = 'testuser@example.com'),
    'User profile should have the correct email'
);

-- Test 6: Verify user_settings has default values
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_settings WHERE user_id = tests.get_supabase_uid('test_user') AND theme = 'system' AND language = 'en' AND notifications_enabled = true),
    'User settings should have correct default values'
);

-- Test 7: Verify user_profiles has derived full_name
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_profiles WHERE user_id = tests.get_supabase_uid('test_user') AND full_name = 'testuser'),
    'User profile should have correct derived full_name'
);

-- Finish the tests
SELECT * FROM finish();

-- Rollback the transaction to keep the database clean
ROLLBACK;
