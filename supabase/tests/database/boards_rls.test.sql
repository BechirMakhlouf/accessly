-- Boards RLS Tests with pgTAP using Basejump supabase-test-helpers
-- Covers: insert (org admin), select visibility/member access, update/delete (board admin), board_members CRUD

-- Plan number of tests (adjust if adding more)
SELECT plan(12);

BEGIN;

-- Ensure clean auth context
SELECT tests.clear_authentication();

-- Create users
SELECT tests.create_supabase_user('alice', 'alice@example.com');
SELECT tests.create_supabase_user('bob', 'bob@example.com');
SELECT tests.create_supabase_user('charlie', 'charlie@example.com');

-- Prepare temp context to store org/board ids
DROP TABLE IF EXISTS tmp_ctx;
CREATE TEMP TABLE tmp_ctx (org_id uuid, board_id uuid);

-- Create organization and membership using service role, then add members
-- If supabase-test-helpers exposes service role auth, prefer it; otherwise direct inserts should run under privileged test role
SELECT tests.authenticate_as('alice');
INSERT INTO public.organizations (id, slug, name, created_by)
VALUES (gen_random_uuid(), 'org_' || substr(gen_random_uuid()::text,1,6), 'Test Org', tests.get_supabase_uid('alice'))
RETURNING id INTO STRICT (SELECT org_id FROM tmp_ctx);
-- Capture generated id
WITH ins AS (
  INSERT INTO public.organizations (id, slug, name, created_by)
  VALUES (gen_random_uuid(), 'org_' || substr(gen_random_uuid()::text,1,6), 'Test Org', tests.get_supabase_uid('alice'))
  RETURNING id
)
UPDATE tmp_ctx SET org_id = (SELECT id FROM ins);

-- Make alice admin of org, add bob admin and charlie member
INSERT INTO public.organization_members (user_id, organization_id, role)
VALUES
  (tests.get_supabase_uid('alice'), (SELECT org_id FROM tmp_ctx), 'admin'),
  (tests.get_supabase_uid('bob'),   (SELECT org_id FROM tmp_ctx), 'admin'),
  (tests.get_supabase_uid('charlie'), (SELECT org_id FROM tmp_ctx), 'member')
ON CONFLICT (user_id, organization_id) DO NOTHING;
SELECT tests.clear_authentication();

SELECT tests.authenticate_as('alice');
INSERT INTO public.boards (organization_id, title, visibility)
VALUES ((SELECT org_id FROM tmp_ctx), 'Alpha Board', 'public')
RETURNING id INTO STRICT (SELECT board_id FROM tmp_ctx);
-- Workaround: capture returning into temp table
WITH ins AS (
  INSERT INTO public.boards (organization_id, title, visibility)
  VALUES ((SELECT org_id FROM tmp_ctx), 'Alpha Board', 'public')
  RETURNING id
)
UPDATE tmp_ctx SET board_id = (SELECT id FROM ins);
-- Make the board private for visibility tests
UPDATE public.boards SET visibility = 'private' WHERE id = (SELECT board_id FROM tmp_ctx);
SELECT tests.clear_authentication();

-- Verify board exists
SELECT ok(EXISTS(SELECT 1 FROM public.boards WHERE id = (SELECT board_id FROM tmp_ctx)), 'Board inserted');

-- On insert trigger should add creator as admin member
SELECT ok(EXISTS(
  SELECT 1 FROM public.board_members bm
  WHERE bm.board_id = (SELECT board_id FROM tmp_ctx)
    AND bm.user_id = tests.get_supabase_uid('alice')
    AND bm.role = 'admin'
), 'Creator added as admin member');

-- Select rules: member view public or membership
-- Anonymous cannot see private boards
SELECT tests.clear_authentication();
SELECT is(
  (SELECT count(*) FROM public.boards WHERE id = (SELECT board_id FROM tmp_ctx)),
  0::bigint,
  'Anon cannot see private board'
);

-- Member can see their board (alice)
SELECT tests.authenticate_as('alice');
SELECT is(
  (SELECT count(*) FROM public.boards WHERE id = (SELECT board_id FROM tmp_ctx)),
  1::bigint,
  'Member can see private board'
);
SELECT tests.clear_authentication();

-- Non-board-member (charlie) cannot see private board
SELECT tests.authenticate_as('charlie');
SELECT is(
  (SELECT count(*) FROM public.boards WHERE id = (SELECT board_id FROM tmp_ctx)),
  0::bigint,
  'Non-board-member cannot see private board'
);
SELECT tests.clear_authentication();

-- Board admin (alice) can update board
SELECT tests.authenticate_as('alice');
UPDATE public.boards SET title = 'Alpha Board Updated' WHERE id = (SELECT board_id FROM tmp_ctx);
SELECT ok(EXISTS(SELECT 1 FROM public.boards WHERE id = (SELECT board_id FROM tmp_ctx) AND title = 'Alpha Board Updated'), 'Board admin can update');
SELECT tests.clear_authentication();

-- Board members CRUD: admin can add member
SELECT tests.authenticate_as('alice');
INSERT INTO public.board_members (user_id, board_id, role)
VALUES (tests.get_supabase_uid('bob'), (SELECT board_id FROM tmp_ctx), 'member');
SELECT tests.clear_authentication();
SELECT ok(EXISTS(
  SELECT 1 FROM public.board_members WHERE board_id = (SELECT board_id FROM tmp_ctx) AND user_id = tests.get_supabase_uid('bob')
), 'Admin added member');

-- Non-admin cannot add member
SELECT tests.authenticate_as('charlie');
SELECT throws_ok(
  $$INSERT INTO public.board_members (user_id, board_id, role)
    VALUES (tests.get_supabase_uid('charlie'), (SELECT board_id FROM tmp_ctx), 'member')$$,
  NULL,
  'Non-admin cannot add board member'
);
SELECT tests.clear_authentication();

SELECT tests.authenticate_as('alice');
DELETE FROM public.boards WHERE id = (SELECT board_id FROM tmp_ctx);
SELECT ok(NOT EXISTS(SELECT 1 FROM public.boards WHERE id = (SELECT board_id FROM tmp_ctx)), 'Admin deleted board');
SELECT tests.clear_authentication();

-- Finish
SELECT * FROM finish();
ROLLBACK;

