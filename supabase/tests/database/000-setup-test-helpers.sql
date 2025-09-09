-- Setup Test Helpers for Supabase Testing
-- This file sets up the testing environment with pgTAP and test helpers
-- Based on: https://github.com/usebasejump/supabase-test-helpers

-- Install pgTAP extension for testing
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

-- Create test helpers schema
CREATE SCHEMA IF NOT EXISTS tests;

-- Grant permissions on the tests schema
GRANT USAGE ON SCHEMA tests TO public;
GRANT ALL ON ALL TABLES IN SCHEMA tests TO public;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA tests TO public;
GRANT ALL ON ALL SEQUENCES IN SCHEMA tests TO public;

-- Create test users table to track created users
CREATE TABLE IF NOT EXISTS tests.test_users (
    identifier text PRIMARY KEY,
    user_id uuid NOT NULL,
    email text,
    phone text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Function to create a test user
CREATE OR REPLACE FUNCTION tests.create_supabase_user(
    identifier text,
    email text DEFAULT NULL,
    phone text DEFAULT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id uuid;
BEGIN
    -- Generate a UUID for the user
    user_id := gen_random_uuid();
    
    -- Insert into auth.users (simplified version for testing)
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
        aud
    ) VALUES (
        user_id,
        COALESCE(email, identifier || '@test.com'),
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        COALESCE(metadata, '{}'::jsonb),
        false,
        'authenticated',
        'authenticated'
    );
    
    -- Track the test user
    INSERT INTO tests.test_users (identifier, user_id, email, phone, metadata)
    VALUES (identifier, user_id, COALESCE(email, identifier || '@test.com'), phone, COALESCE(metadata, '{}'::jsonb));
    
    RETURN user_id;
END;
$$;

-- Function to get user UUID by identifier
CREATE OR REPLACE FUNCTION tests.get_supabase_uid(identifier text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id uuid;
BEGIN
    SELECT tu.user_id INTO user_id
    FROM tests.test_users tu
    WHERE tu.identifier = get_supabase_uid.identifier;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Test user with identifier % not found', identifier;
    END IF;
    
    RETURN user_id;
END;
$$;

-- Function to get user info by identifier
CREATE OR REPLACE FUNCTION tests.get_supabase_user(identifier text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_data json;
BEGIN
    SELECT to_json(tu.*) INTO user_data
    FROM tests.test_users tu
    WHERE tu.identifier = get_supabase_user.identifier;
    
    IF user_data IS NULL THEN
        RAISE EXCEPTION 'Test user with identifier % not found', identifier;
    END IF;
    
    RETURN user_data;
END;
$$;

-- Function to authenticate as a test user
CREATE OR REPLACE FUNCTION tests.authenticate_as(identifier text)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    user_id uuid;
    user_email text;
BEGIN
    SELECT tu.user_id, tu.email INTO user_id, user_email
    FROM tests.test_users tu
    WHERE tu.identifier = authenticate_as.identifier;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Test user with identifier % not found', identifier;
    END IF;
    
    -- Set the role and user context
    PERFORM set_config('role', 'authenticated', true);
    PERFORM set_config('request.jwt.claim.sub', user_id::text, true);
    PERFORM set_config('request.jwt.claim.email', user_email, true);
END;
$$;

-- Function to authenticate as service role
CREATE OR REPLACE FUNCTION tests.authenticate_as_service_role()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM set_config('role', 'service_role', true);
    PERFORM set_config('request.jwt.claim.sub', NULL, true);
    PERFORM set_config('request.jwt.claim.email', NULL, true);
END;
$$;

-- Function to clear authentication
CREATE OR REPLACE FUNCTION tests.clear_authentication()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM set_config('role', 'anon', true);
    PERFORM set_config('request.jwt.claim.sub', NULL, true);
    PERFORM set_config('request.jwt.claim.email', NULL, true);
END;
$$;

-- Function to check if RLS is enabled on a table
CREATE OR REPLACE FUNCTION tests.rls_enabled(schema_name text, table_name text DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rls_enabled boolean;
    result text;
BEGIN
    IF table_name IS NULL THEN
        -- Check all tables in schema
        SELECT NOT EXISTS(
            SELECT 1 
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = schema_name
            AND c.relkind = 'r'
            AND NOT c.relrowsecurity
        ) INTO rls_enabled;
        
        IF rls_enabled THEN
            result := 'RLS is enabled on all tables in schema ' || schema_name;
        ELSE
            result := 'RLS is NOT enabled on all tables in schema ' || schema_name;
        END IF;
    ELSE
        -- Check specific table
        SELECT c.relrowsecurity INTO rls_enabled
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = schema_name
        AND c.relname = table_name
        AND c.relkind = 'r';
        
        IF rls_enabled THEN
            result := 'RLS is enabled on table ' || schema_name || '.' || table_name;
        ELSE
            result := 'RLS is NOT enabled on table ' || schema_name || '.' || table_name;
        END IF;
    END IF;
    
    RETURN result;
END;
$$;

-- Function to freeze time (simplified version)
CREATE OR REPLACE FUNCTION tests.freeze_time(frozen_time timestamptz)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Store the frozen time in a session variable
    PERFORM set_config('tests.frozen_time', frozen_time::text, true);
END;
$$;

-- Function to unfreeze time
CREATE OR REPLACE FUNCTION tests.unfreeze_time()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Clear the frozen time
    PERFORM set_config('tests.frozen_time', NULL, true);
END;
$$;

-- Grant permissions on all functions and tables in tests schema
GRANT ALL ON ALL TABLES IN SCHEMA tests TO public;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA tests TO public;
GRANT ALL ON ALL SEQUENCES IN SCHEMA tests TO public;

-- Verify setup with a basic test
BEGIN;
    SELECT plan(7);
    SELECT ok(EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'create_supabase_user' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'tests')), 'create_supabase_user function exists');
    SELECT ok(EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'get_supabase_uid' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'tests')), 'get_supabase_uid function exists');
    SELECT ok(EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'get_supabase_user' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'tests')), 'get_supabase_user function exists');
    SELECT ok(EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'authenticate_as' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'tests')), 'authenticate_as function exists');
    SELECT ok(EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'clear_authentication' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'tests')), 'clear_authentication function exists');
    SELECT ok(EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'rls_enabled' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'tests')), 'rls_enabled function exists');
    SELECT ok(EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'freeze_time' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'tests')), 'freeze_time function exists');
    SELECT * FROM finish();
ROLLBACK;
