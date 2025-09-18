set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_board_members(p_board_id uuid)
 RETURNS TABLE(user_id uuid, role boards_role, membership_origin text)
 LANGUAGE sql
AS $function$
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
$function$
;


