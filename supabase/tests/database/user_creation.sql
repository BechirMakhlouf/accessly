-- User Creation Test with pgTAP
-- This test verifies that when a user is created in auth.users,
-- corresponding rows are automatically created in public.user_profiles and public.user_settings

-- Load pgTAP functions
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Plan the number of tests
SELECT plan(6);

-- Test data
\set test_user_id '00000000-0000-0000-0000-000000000001'
\set test_email 'testuser@example.com'

-- Begin transaction to ensure test isolation
BEGIN;

-- Test 1: Insert a new user into auth.users
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
    :'test_user_id'::uuid,
    :'test_email',
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

-- Test 2: Verify user was created in auth.users
SELECT ok(
    EXISTS(SELECT 1 FROM auth.users WHERE id = :'test_user_id'::uuid),
    'User should be created in auth.users'
);

-- Test 3: Verify corresponding row exists in public.user_profiles
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_profiles WHERE id = :'test_user_id'::uuid),
    'A row should be added to public.user_profiles after user creation'
);

-- Test 4: Verify corresponding row exists in public.user_settings
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_settings WHERE id = :'test_user_id'::uuid),
    'A row should be added to public.user_settings after user creation'
);

-- Test 5: Verify user_profiles has correct email
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_profiles WHERE id = :'test_user_id'::uuid AND email = :'test_email'),
    'User profile should have the correct email'
);

-- Test 6: Verify user_settings has default values
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_settings WHERE id = :'test_user_id'::uuid AND theme = 'system' AND language = 'en' AND notifications_enabled = true),
    'User settings should have correct default values'
);

-- Test 7: Verify user_profiles has derived full_name
SELECT ok(
    EXISTS(SELECT 1 FROM public.user_profiles WHERE id = :'test_user_id'::uuid AND full_name = 'testuser'),
    'User profile should have correct derived full_name'
);

-- Finish the tests
SELECT * FROM finish();

-- Rollback the transaction to keep the database clean
ROLLBACK;
