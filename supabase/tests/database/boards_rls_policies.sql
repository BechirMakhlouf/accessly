-- Boards RLS Policies Test with pgTAP and Test Helpers
-- This test verifies that RLS policies work correctly for the boards module
-- Tests cover boards and board_members tables with various user roles and scenarios

-- Plan the number of tests
SELECT plan(45);

-- Begin transaction to ensure test isolation
BEGIN;

-- ==============================================
-- SETUP: Create test users and organizations
-- ==============================================

-- Create test users
SELECT tests.create_supabase_user('admin_user', 'admin@example.com');
SELECT tests.create_supabase_user('member_user', 'member@example.com');
SELECT tests.create_supabase_user('non_member_user', 'nonmember@example.com');
SELECT tests.create_supabase_user('other_org_user', 'other@example.com');

-- Create test organization (using service role to bypass RLS)
SELECT tests.authenticate_as_service_role();

-- Insert test organization
INSERT INTO public.organizations (id, slug, name, description, created_by)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'test-org',
    'Test Organization',
    'Test organization for RLS testing',
    tests.get_supabase_uid('admin_user')
);

-- Add admin_user as admin of the organization
INSERT INTO public.organization_members (user_id, organization_id, role)
VALUES (
    tests.get_supabase_uid('admin_user'),
    '11111111-1111-1111-1111-111111111111',
    'admin'
);

-- Add member_user as member of the organization
INSERT INTO public.organization_members (user_id, organization_id, role)
VALUES (
    tests.get_supabase_uid('member_user'),
    '11111111-1111-1111-1111-111111111111',
    'member'
);

-- Create another organization for other_org_user
INSERT INTO public.organizations (id, slug, name, description, created_by)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'other-org',
    'Other Organization',
    'Other organization for RLS testing',
    tests.get_supabase_uid('other_org_user')
);

INSERT INTO public.organization_members (user_id, organization_id, role)
VALUES (
    tests.get_supabase_uid('other_org_user'),
    '22222222-2222-2222-2222-222222222222',
    'admin'
);

-- ==============================================
-- TEST 1: RLS is enabled on boards tables
-- ==============================================

SELECT ok(
    tests.rls_enabled('public', 'boards') LIKE '%RLS is enabled%',
    'RLS should be enabled on boards table'
);

SELECT ok(
    tests.rls_enabled('public', 'board_members') LIKE '%RLS is enabled%',
    'RLS should be enabled on board_members table'
);

-- ==============================================
-- TEST 2: Boards table policies - SELECT (public boards)
-- ==============================================

-- Test that non-authenticated users cannot see any boards
SELECT tests.clear_authentication();

SELECT ok(
    NOT EXISTS(SELECT 1 FROM public.boards),
    'Non-authenticated users should not see any boards'
);

-- Test that authenticated users can see public boards
SELECT tests.authenticate_as('non_member_user');

-- Create a public board (using service role)
SELECT tests.authenticate_as_service_role();
INSERT INTO public.boards (id, organization_id, title, description, privacy, created_by)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Public Test Board',
    'A public board for testing',
    'public',
    tests.get_supabase_uid('admin_user')
);

-- Switch back to non_member_user and test visibility
SELECT tests.authenticate_as('non_member_user');

SELECT ok(
    EXISTS(SELECT 1 FROM public.boards WHERE id = '33333333-3333-3333-3333-333333333333'),
    'Non-member authenticated users should see public boards'
);

-- ==============================================
-- TEST 3: Boards table policies - SELECT (private boards)
-- ==============================================

-- Create a private board
SELECT tests.authenticate_as_service_role();
INSERT INTO public.boards (id, organization_id, title, description, privacy, created_by)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Private Test Board',
    'A private board for testing',
    'private',
    tests.get_supabase_uid('admin_user')
);

-- Add admin_user as admin of the private board (this happens automatically via trigger)
-- Add member_user as member of the private board
INSERT INTO public.board_members (user_id, board_id, role)
VALUES (
    tests.get_supabase_uid('member_user'),
    '44444444-4444-4444-4444-444444444444',
    'member'
);

-- Test that non-member cannot see private board
SELECT tests.authenticate_as('non_member_user');

SELECT ok(
    NOT EXISTS(SELECT 1 FROM public.boards WHERE id = '44444444-4444-4444-4444-444444444444'),
    'Non-member users should not see private boards'
);

-- Test that member can see private board
SELECT tests.authenticate_as('member_user');

SELECT ok(
    EXISTS(SELECT 1 FROM public.boards WHERE id = '44444444-4444-4444-4444-444444444444'),
    'Board members should see private boards they belong to'
);

-- Test that admin can see private board
SELECT tests.authenticate_as('admin_user');

SELECT ok(
    EXISTS(SELECT 1 FROM public.boards WHERE id = '44444444-4444-4444-4444-444444444444'),
    'Board admins should see private boards they belong to'
);

-- ==============================================
-- TEST 4: Boards table policies - INSERT
-- ==============================================

-- Test that non-authenticated users cannot create boards
SELECT tests.clear_authentication();

SELECT throws_ok(
    'INSERT INTO public.boards (organization_id, title, created_by) VALUES (''11111111-1111-1111-1111-111111111111'', ''Test Board'', ''11111111-1111-1111-1111-111111111111'')',
    'Non-authenticated users should not be able to create boards'
);

-- Test that authenticated users can create boards (this should work due to trigger adding them as admin)
SELECT tests.authenticate_as('admin_user');

-- This should succeed and automatically add the creator as admin
INSERT INTO public.boards (id, organization_id, title, description, privacy, created_by)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'New Test Board',
    'A newly created board',
    'public',
    tests.get_supabase_uid('admin_user')
);

-- Verify the creator was automatically added as admin
SELECT ok(
    EXISTS(
        SELECT 1 FROM public.board_members 
        WHERE board_id = '55555555-5555-5555-5555-555555555555' 
        AND user_id = tests.get_supabase_uid('admin_user')
        AND role = 'admin'
    ),
    'Board creator should be automatically added as admin'
);

-- ==============================================
-- TEST 5: Boards table policies - UPDATE
-- ==============================================

-- Test that non-members cannot update boards
SELECT tests.authenticate_as('non_member_user');

SELECT throws_ok(
    'UPDATE public.boards SET title = ''Hacked Title'' WHERE id = ''33333333-3333-3333-3333-333333333333''',
    'Non-members should not be able to update boards'
);

-- Test that members cannot update boards (only admins can)
SELECT tests.authenticate_as('member_user');

SELECT throws_ok(
    'UPDATE public.boards SET title = ''Hacked Title'' WHERE id = ''44444444-4444-4444-4444-444444444444''',
    'Members should not be able to update boards'
);

-- Test that admins can update boards
SELECT tests.authenticate_as('admin_user');

-- This should succeed
UPDATE public.boards 
SET title = 'Updated Title', description = 'Updated description'
WHERE id = '44444444-4444-4444-4444-444444444444';

SELECT ok(
    EXISTS(
        SELECT 1 FROM public.boards 
        WHERE id = '44444444-4444-4444-4444-444444444444' 
        AND title = 'Updated Title'
    ),
    'Admins should be able to update boards'
);

-- ==============================================
-- TEST 6: Boards table policies - DELETE
-- ==============================================

-- Test that non-members cannot delete boards
SELECT tests.authenticate_as('non_member_user');

SELECT throws_ok(
    'DELETE FROM public.boards WHERE id = ''33333333-3333-3333-3333-333333333333''',
    'Non-members should not be able to delete boards'
);

-- Test that members cannot delete boards (only admins can)
SELECT tests.authenticate_as('member_user');

SELECT throws_ok(
    'DELETE FROM public.boards WHERE id = ''44444444-4444-4444-4444-444444444444''',
    'Members should not be able to delete boards'
);

-- Test that admins can delete boards
SELECT tests.authenticate_as('admin_user');

-- This should succeed
DELETE FROM public.boards WHERE id = '55555555-5555-5555-5555-555555555555';

SELECT ok(
    NOT EXISTS(SELECT 1 FROM public.boards WHERE id = '55555555-5555-5555-5555-555555555555'),
    'Admins should be able to delete boards'
);

-- ==============================================
-- TEST 7: Board_members table policies - SELECT
-- ==============================================

-- Test that non-members cannot see board members
SELECT tests.authenticate_as('non_member_user');

SELECT ok(
    NOT EXISTS(SELECT 1 FROM public.board_members WHERE board_id = '44444444-4444-4444-4444-444444444444'),
    'Non-members should not see board members'
);

-- Test that members can see board members
SELECT tests.authenticate_as('member_user');

SELECT ok(
    EXISTS(SELECT 1 FROM public.board_members WHERE board_id = '44444444-4444-4444-4444-444444444444'),
    'Board members should see other board members'
);

-- Test that admins can see board members
SELECT tests.authenticate_as('admin_user');

SELECT ok(
    EXISTS(SELECT 1 FROM public.board_members WHERE board_id = '44444444-4444-4444-4444-444444444444'),
    'Board admins should see board members'
);

-- ==============================================
-- TEST 8: Board_members table policies - INSERT
-- ==============================================

-- Test that non-members cannot add board members
SELECT tests.authenticate_as('non_member_user');

SELECT throws_ok(
    'INSERT INTO public.board_members (user_id, board_id, role) VALUES (tests.get_supabase_uid(''other_org_user''), ''33333333-3333-3333-3333-333333333333'', ''member'')',
    'Non-members should not be able to add board members'
);

-- Test that members cannot add board members (only admins can)
SELECT tests.authenticate_as('member_user');

SELECT throws_ok(
    'INSERT INTO public.board_members (user_id, board_id, role) VALUES (tests.get_supabase_uid(''other_org_user''), ''44444444-4444-4444-4444-444444444444'', ''member'')',
    'Members should not be able to add board members'
);

-- Test that admins can add board members
SELECT tests.authenticate_as('admin_user');

-- This should succeed
INSERT INTO public.board_members (user_id, board_id, role)
VALUES (
    tests.get_supabase_uid('other_org_user'),
    '33333333-3333-3333-3333-333333333333',
    'member'
);

SELECT ok(
    EXISTS(
        SELECT 1 FROM public.board_members 
        WHERE board_id = '33333333-3333-3333-3333-333333333333' 
        AND user_id = tests.get_supabase_uid('other_org_user')
    ),
    'Admins should be able to add board members'
);

-- ==============================================
-- TEST 9: Board_members table policies - UPDATE
-- ==============================================

-- Test that non-members cannot update board members
SELECT tests.authenticate_as('non_member_user');

SELECT throws_ok(
    'UPDATE public.board_members SET role = ''admin'' WHERE board_id = ''44444444-4444-4444-4444-444444444444'' AND user_id = tests.get_supabase_uid(''member_user'')',
    'Non-members should not be able to update board members'
);

-- Test that members cannot update board members (only admins can)
SELECT tests.authenticate_as('member_user');

SELECT throws_ok(
    'UPDATE public.board_members SET role = ''admin'' WHERE board_id = ''44444444-4444-4444-4444-444444444444'' AND user_id = tests.get_supabase_uid(''member_user'')',
    'Members should not be able to update board members'
);

-- Test that admins can update board members
SELECT tests.authenticate_as('admin_user');

-- This should succeed
UPDATE public.board_members 
SET role = 'admin'
WHERE board_id = '44444444-4444-4444-4444-444444444444' 
AND user_id = tests.get_supabase_uid('member_user');

SELECT ok(
    EXISTS(
        SELECT 1 FROM public.board_members 
        WHERE board_id = '44444444-4444-4444-4444-444444444444' 
        AND user_id = tests.get_supabase_uid('member_user')
        AND role = 'admin'
    ),
    'Admins should be able to update board members'
);

-- ==============================================
-- TEST 10: Board_members table policies - DELETE
-- ==============================================

-- Test that non-members cannot remove board members
SELECT tests.authenticate_as('non_member_user');

SELECT throws_ok(
    'DELETE FROM public.board_members WHERE board_id = ''44444444-4444-4444-4444-444444444444'' AND user_id = tests.get_supabase_uid(''member_user'')',
    'Non-members should not be able to remove board members'
);

-- Test that members cannot remove board members (only admins can)
SELECT tests.authenticate_as('member_user');

SELECT throws_ok(
    'DELETE FROM public.board_members WHERE board_id = ''44444444-4444-4444-4444-444444444444'' AND user_id = tests.get_supabase_uid(''other_org_user'')',
    'Members should not be able to remove board members'
);

-- Test that admins can remove board members
SELECT tests.authenticate_as('admin_user');

-- This should succeed
DELETE FROM public.board_members 
WHERE board_id = '33333333-3333-3333-3333-333333333333' 
AND user_id = tests.get_supabase_uid('other_org_user');

SELECT ok(
    NOT EXISTS(
        SELECT 1 FROM public.board_members 
        WHERE board_id = '33333333-3333-3333-3333-333333333333' 
        AND user_id = tests.get_supabase_uid('other_org_user')
    ),
    'Admins should be able to remove board members'
);

-- ==============================================
-- TEST 11: Edge cases and additional scenarios
-- ==============================================

-- Test that users from different organizations cannot see each other's boards
SELECT tests.authenticate_as('other_org_user');

SELECT ok(
    NOT EXISTS(SELECT 1 FROM public.boards WHERE organization_id = '11111111-1111-1111-1111-111111111111'),
    'Users from different organizations should not see each other''s boards'
);

-- Test that deleted users' boards are still accessible to members
-- (This tests the ON DELETE SET NULL constraint)
SELECT tests.authenticate_as_service_role();

-- Create a board with a user, then "delete" the user by setting created_by to NULL
INSERT INTO public.boards (id, organization_id, title, description, privacy, created_by)
VALUES (
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Orphaned Board',
    'A board whose creator was deleted',
    'public',
    tests.get_supabase_uid('admin_user')
);

-- Simulate user deletion by setting created_by to NULL
UPDATE public.boards 
SET created_by = NULL 
WHERE id = '66666666-6666-6666-6666-666666666666';

-- Test that the board is still visible (public board)
SELECT tests.authenticate_as('non_member_user');

SELECT ok(
    EXISTS(SELECT 1 FROM public.boards WHERE id = '66666666-6666-6666-6666-666666666666'),
    'Public boards should still be visible even if creator is deleted'
);

-- ==============================================
-- TEST 12: Test the is_board_member function
-- ==============================================

-- Test that the function correctly identifies board members
SELECT tests.authenticate_as('member_user');

SELECT ok(
    public.is_board_member('44444444-4444-4444-4444-444444444444'),
    'is_board_member should return true for actual board members'
);

SELECT ok(
    NOT public.is_board_member('33333333-3333-3333-3333-333333333333'),
    'is_board_member should return false for non-members'
);

-- Test that the function works for admins too
SELECT tests.authenticate_as('admin_user');

SELECT ok(
    public.is_board_member('44444444-4444-4444-4444-444444444444'),
    'is_board_member should return true for board admins'
);

-- ==============================================
-- TEST 13: Test privacy constraint
-- ==============================================

-- Test that only 'public' and 'private' privacy values are allowed
SELECT tests.authenticate_as('admin_user');

SELECT throws_ok(
    'INSERT INTO public.boards (organization_id, title, privacy, created_by) VALUES (''11111111-1111-1111-1111-111111111111'', ''Invalid Privacy Board'', ''invalid'', tests.get_supabase_uid(''admin_user''))',
    'Only ''public'' and ''private'' privacy values should be allowed'
);

-- ==============================================
-- TEST 14: Test title length constraint
-- ==============================================

-- Test that title must be between 2 and 100 characters
SELECT throws_ok(
    'INSERT INTO public.boards (organization_id, title, created_by) VALUES (''11111111-1111-1111-1111-111111111111'', ''A'', tests.get_supabase_uid(''admin_user''))',
    'Title should be at least 2 characters long'
);

SELECT throws_ok(
    'INSERT INTO public.boards (organization_id, title, created_by) VALUES (''11111111-1111-1111-1111-111111111111'', repeat(''A'', 101), tests.get_supabase_uid(''admin_user''))',
    'Title should be at most 100 characters long'
);

-- ==============================================
-- CLEANUP AND FINISH
-- ==============================================

-- Finish the tests
SELECT * FROM finish();

-- Rollback the transaction to keep the database clean
ROLLBACK;