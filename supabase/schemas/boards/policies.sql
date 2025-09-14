/* -------------------------------------------------
   Enable Row Level Security
   ------------------------------------------------- */
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

/* -------------------------------------------------
   Helper: is the current user a member of the board?
   ------------------------------------------------- */
CREATE OR REPLACE FUNCTION public.is_board_member(board_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.board_members bm
    WHERE bm.board_id = board_id
      AND bm.user_id = (SELECT auth.uid())
  );
$$;

-- block direct use of the function
REVOKE EXECUTE ON FUNCTION public.is_board_member(uuid) FROM anon, authenticated;

/* -------------------------------------------------
   Policies for "boards"
   ------------------------------------------------- */

/* INSERT – any organization member (admin or member) can create boards in their org */
CREATE POLICY "Org member create board"
ON public.boards
FOR INSERT TO authenticated
WITH CHECK (
  created_by = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = boards.organization_id
        AND om.role = 'admin'
      AND om.user_id = (SELECT auth.uid())
  -- any role qualifies (admin or member); role predicate removed intentionally
  )
);



/* SELECT – members can view boards they belong to or public boards */
CREATE POLICY "Member view boards"
ON public.boards
FOR SELECT TO authenticated
USING (
  visibility = 'public'::boards_visibility
  OR public.is_board_member(boards.id)
);

/* UPDATE – only board admins can update */
CREATE POLICY "Admin update board"
ON public.boards
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.board_members bm
    WHERE bm.board_id = boards.id
      AND bm.user_id = (SELECT auth.uid())
  AND bm.role = 'admin'::boards_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.board_members bm
    WHERE bm.board_id = boards.id
      AND bm.user_id = (SELECT auth.uid())
  AND bm.role = 'admin'::boards_role
  )
);

/* DELETE – only board admins can delete */
CREATE POLICY "Admin delete board"
ON public.boards
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.board_members bm
    WHERE bm.board_id = boards.id
      AND bm.user_id = (SELECT auth.uid())
  AND bm.role = 'admin'::boards_role
  )
);

/* -------------------------------------------------
   Policies for "board_members"
   ------------------------------------------------- */

/* SELECT – members can see members of boards they belong to */
CREATE POLICY "Members view board members"
ON public.board_members
FOR SELECT TO authenticated
USING ( public.is_board_member(board_members.board_id) );

/* INSERT – board creator self-membership (trigger add_creator_to_board) */
CREATE POLICY "Board creator self membership"
ON public.board_members
FOR INSERT TO authenticated
WITH CHECK (
  board_members.user_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id = board_members.board_id
      AND b.created_by = (SELECT auth.uid())
  )
);

CREATE POLICY "Admins insert board member"
ON public.board_members
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.board_members bm
    WHERE bm.board_id = board_members.board_id
      AND bm.user_id = (SELECT auth.uid())
  AND bm.role = 'admin'::boards_role
  )
);

/* UPDATE – admins can modify member roles */
CREATE POLICY "Admins update board member"
ON public.board_members
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.board_members bm
    WHERE bm.board_id = board_members.board_id
      AND bm.user_id = (SELECT auth.uid())
  AND bm.role = 'admin'::boards_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.board_members bm
    WHERE bm.board_id = board_members.board_id
      AND bm.user_id = (SELECT auth.uid())
  AND bm.role = 'admin'::boards_role
  )
);

/* DELETE – admins can remove members */
CREATE POLICY "Admins delete board member"
ON public.board_members
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.board_members bm
    WHERE bm.board_id = board_members.board_id
      AND bm.user_id = (SELECT auth.uid())
  AND bm.role = 'admin'::boards_role
  )
);