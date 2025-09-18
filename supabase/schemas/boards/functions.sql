CREATE OR REPLACE FUNCTION public.add_creator_to_board()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.board_members(user_id, board_id, role, joined_at, created_at, updated_at)
  VALUES (NEW.created_by, NEW.id, 'admin'::boards_role, now(), now(), now());
  RETURN NEW;
END;
$$;

-- ensure gen_random_uuid() is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- simple slug generator: only takes the title
CREATE OR REPLACE FUNCTION public.generate_board_slug(p_title text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  short_id  text;
BEGIN
  -- slugify the title
  base_slug := lower(trim(coalesce(p_title, 'board')));
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '(^-+)|(-+$)', '', 'g');

  -- if slug is free → return it
  IF NOT EXISTS (
    SELECT 1 FROM public.boards WHERE slug = base_slug
  ) THEN
    RETURN base_slug;
  END IF;

  -- otherwise append first segment of random UUID and return
  short_id := split_part(gen_random_uuid()::text, '-', 1);
  RETURN base_slug || '-' || short_id;
END;
$$;

-- trigger function: sets NEW.slug when empty/null before insert
CREATE OR REPLACE FUNCTION public.set_board_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    NEW.slug := public.generate_board_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_board_membership(p_user_id uuid, p_board_id uuid)
RETURNS TABLE(user_id uuid, board_role public.boards_role)
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
SELECT
  p_user_id AS user_id,
  -- check if user is an admin of the organization that owns the board then 'admin'
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM public.boards b
      JOIN public.organization_members om ON om.organization_id = b.organization_id
      WHERE b.id = p_board_id
        AND om.user_id = p_user_id
        AND om.role = 'admin'
    ) THEN 'admin'::public.boards_role
-- Check if the user is a board member; if so, return their actual role ('admin' or 'member')

    WHEN EXISTS (
      SELECT 1
      FROM public.board_members bm
      WHERE bm.board_id = p_board_id
        AND bm.user_id = p_user_id
     ) THEN (
      SELECT bm.role
      FROM public.board_members bm
      WHERE bm.board_id = p_board_id
        AND bm.user_id = p_user_id
      LIMIT 1
     )

    WHEN EXISTS ( 
      SELECT 1
      FROM public.boards b
      WHERE b.id = p_board_id
        AND b.visibility = 'public'
    ) THEN 'member'::public.boards_role

    ELSE NULL
  END AS board_role;
$$;
-- get  getBoardMembers
CREATE OR REPLACE FUNCTION public.get_board_members(
  p_board_id UUID
)
RETURNS TABLE(user_id UUID, role public.boards_role, membership_origin text)
LANGUAGE sql
SECURITY INVOKER
AS $$
WITH board AS (
  SELECT id, organization_id, visibility
  FROM public.boards
  WHERE id = p_board_id
),
base AS (
  -- 1) organization admins (highest precedence)
  SELECT om.user_id,
    'admin'::public.boards_role AS role,
    1 AS priority,
    'org_admin' AS membership_origin
  FROM public.organization_members om
  JOIN board b ON b.organization_id = om.organization_id
  WHERE om.role::text = 'admin'

  UNION ALL

  -- 2) explicit board members (only admin or member)
  SELECT bm.user_id,
    CASE bm.role::text
      WHEN 'admin'  THEN 'admin'::public.boards_role
      ELSE 'member'::public.boards_role
    END AS role,
    2 AS priority,
    'board_member' AS membership_origin
  FROM public.board_members bm
  JOIN board b ON b.id = bm.board_id

  UNION ALL

  -- 3) org members if board is public (lowest precedence)
  SELECT om.user_id,
    'member'::public.boards_role AS role,
    3 AS priority,
    'org_member' AS membership_origin
  FROM public.organization_members om
  JOIN board b ON b.organization_id = om.organization_id
  WHERE b.visibility = 'public'
)
SELECT DISTINCT ON (user_id) user_id, role, membership_origin
FROM base
WHERE EXISTS (SELECT 1 FROM board) -- return empty if board not found
ORDER BY user_id, priority;
$$;


-- create trigger (drop if exists to avoid duplicates)
DROP TRIGGER IF EXISTS set_board_slug_trigger ON public.boards;
CREATE TRIGGER set_board_slug_trigger
BEFORE INSERT ON public.boards
FOR EACH ROW
EXECUTE FUNCTION public.set_board_slug();

