-- User Creation Edge Cases Test with pgTAP
-- This test verifies edge cases for user creation and profile/settings insertion

-- Load pgTAP functions
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Plan the number of tests
SELECT plan(3);

-- Test data
\set test_user_id_1 '00000000-0000-0000-0000-000000000002'
\set test_email_1 'edgecase1@example.com'

-- Begin transaction to ensure test isolation
BEGIN;

-- Test 1: User with email but no full_name (should derive from email)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    :'test_user_id_1'::uuid,
    :'test_email_1',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    ''
);

-- Test 2: Verify user was created
SELECT ok(
    EXISTS(SELECT 1 FROM auth.users WHERE id = :'test_user_id_1'::uuid),
    'User should be created in auth.users'
);

-- Test 3: Verify profile was created with derived full_name
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_profiles WHERE id = :'test_user_id_1'::uuid AND full_name = 'edgecase1'),
    'User profile should have derived full_name from email'
);

-- Test 4: Verify settings were created with defaults
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_settings WHERE id = :'test_user_id_1'::uuid AND theme = 'system' AND language = 'en' AND notifications_enabled = true),
    'User settings should have correct default values'
);

-- Finish the tests
SELECT * FROM finish();

-- Rollback the transaction to keep the database clean
ROLLBACK;
