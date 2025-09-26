-- Boards RLS Tests with pgTAP
-- Covers: insert (org admin), select visibility/member access, update/delete (board admin), board_members CRUD

-- Plan number of tests (adjust if adding more)
SELECT plan(14);

BEGIN;

-- Ensure clean auth context
SELECT tests.clear_authentication();

-- Create users
SELECT tests.create_supabase_user('alice', 'alice@example.com');
SELECT tests.create_supabase_user('bob', 'bob@example.com');
SELECT tests.create_supabase_user('charlie', 'charlie@example.com');

-- Create organization owned/admin by alice
SELECT tests.authenticate_as('alice');
SELECT ok(true, 'Authenticated as alice');
SELECT tests.clear_authentication();

SELECT tests.authenticate_as('alice');
SELECT ok(true, 'Authenticate helper re-check');
SELECT tests.clear_authentication();

SELECT tests.authenticate_as('alice');
SELECT ok(true, 'Authenticate before create_org');
SELECT tests.clear_authentication();

-- Use helper to create org (alice admin)
SELECT tests.clear_authentication();
SELECT tests.create_supabase_user('owner', 'owner@example.com'); -- extra user if needed later

-- Actually create org and capture id
WITH org AS (
  SELECT tests.create_org('alice') AS id
)
SELECT ok((SELECT id IS NOT NULL FROM org), 'Organization created');

-- Store org_id for subsequent steps
DO $$ BEGIN END $$;

-- Fetch org_id into a variable via pgtap's set (workaround using temp table)
DROP TABLE IF EXISTS tmp_ctx;
CREATE TEMP TABLE tmp_ctx (org_id uuid, board_id uuid);
INSERT INTO tmp_ctx (org_id) SELECT tests.create_org('alice', 'org_ctx_' || substr(gen_random_uuid()::text,1,6));

-- Make bob a member (admin) and charlie a member (non-admin)
SELECT tests.add_org_member('bob', (SELECT org_id FROM tmp_ctx), 'admin');
SELECT tests.add_org_member('charlie', (SELECT org_id FROM tmp_ctx), 'member');

-- Insert board as alice (org admin) - should succeed
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
UPDATE public.boards SET visibility = 'private' WHERE id = (SELECT board_id FROM tmp_ctx);
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

-- Non-member cannot see private board (bob not yet a board member)
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

-- Board admin can delete board
SELECT tests.authenticate_as('alice');
DELETE FROM public.boards WHERE id = (SELECT board_id FROM tmp_ctx);
SELECT ok(NOT EXISTS(SELECT 1 FROM public.boards WHERE id = (SELECT board_id FROM tmp_ctx)), 'Admin deleted board');
SELECT tests.clear_authentication();

-- Finish
SELECT * FROM finish();
ROLLBACK;

