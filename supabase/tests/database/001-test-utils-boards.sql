-- Boards/Organizations Test Utilities
-- Provides helper functions to create orgs, add org members, create boards, and cleanup

-- Ensure pgTAP is available for any assertions within helpers (optional)
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

-- Helpers live in tests schema created by 000-setup-test-helpers.sql
CREATE SCHEMA IF NOT EXISTS tests;

-- Create an organization owned/admin-ed by a given test user
CREATE OR REPLACE FUNCTION tests.create_org(
    identifier text,
    p_slug text DEFAULT NULL,
    p_name text DEFAULT 'Test Org'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    org_id uuid;
    uid uuid;
BEGIN
    uid := tests.get_supabase_uid(identifier);
    org_id := gen_random_uuid();

    INSERT INTO public.organizations (id, slug, name, description, created_by)
    VALUES (
        org_id,
        COALESCE(p_slug, 'org_' || substring(org_id::text from 1 for 8)),
        p_name,
        '',
        uid
    );

    -- Make the user an admin of the org
    INSERT INTO public.organization_members (user_id, organization_id, role)
    VALUES (uid, org_id, 'admin');

    RETURN org_id;
END;
$$;

-- Add an existing user to an organization with a role
CREATE OR REPLACE FUNCTION tests.add_org_member(
    identifier text,
    org_id uuid,
    p_role public.organization_role DEFAULT 'member'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    uid uuid;
BEGIN
    uid := tests.get_supabase_uid(identifier);
    INSERT INTO public.organization_members (user_id, organization_id, role)
    VALUES (uid, org_id, p_role)
    ON CONFLICT (user_id, organization_id) DO UPDATE SET role = EXCLUDED.role;
END;
$$;

-- Create a board under an organization as a given user
CREATE OR REPLACE FUNCTION tests.create_board(
    creator_identifier text,
    org_id uuid,
    p_title text DEFAULT 'Test Board',
    p_visibility public.boards_visibility DEFAULT 'public'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    board_id uuid;
BEGIN
    PERFORM tests.authenticate_as(creator_identifier);
    INSERT INTO public.boards (organization_id, title, visibility)
    VALUES (org_id, p_title, p_visibility)
    RETURNING id INTO board_id;
    PERFORM tests.clear_authentication();
    RETURN board_id;
END;
$$;

-- Cleanup helper: delete an org (cascades), requires service role
CREATE OR REPLACE FUNCTION tests.cleanup_org(org_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM tests.authenticate_as_service_role();
    DELETE FROM public.organizations WHERE id = org_id;
    PERFORM tests.clear_authentication();
END;
$$;

