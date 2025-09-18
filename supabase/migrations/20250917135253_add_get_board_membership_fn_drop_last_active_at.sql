alter table "public"."board_members" drop column "last_active_at";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_board_membership(p_user_id uuid, p_board_id uuid)
 RETURNS TABLE(user_id uuid, board_role boards_role)
 LANGUAGE sql
 SET search_path TO ''
AS $function$
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
$function$
;


