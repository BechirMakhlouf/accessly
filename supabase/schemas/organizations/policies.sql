/* -------------------------------------------------
   Enable Row Level Security
   ------------------------------------------------- */
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

/* -------------------------------------------------
   Helper: is the current user a member of the org?
   ------------------------------------------------- */
CREATE OR REPLACE FUNCTION public.is_org_member(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER      -- runs as owner, bypasses RLS on organization_members
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = org_id
      AND om.user_id = (SELECT auth.uid())
  );
$$;

-- block direct use of the function
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid) FROM anon, authenticated;

/* -------------------------------------------------
   Policies for "organizations"
   ------------------------------------------------- */

/* INSERT – creator can create its own org */
CREATE POLICY "Create own organization"
ON public.organizations
FOR INSERT TO authenticated
WITH CHECK ( (SELECT auth.uid()) = created_by );

/* SELECT – members can view their org */
CREATE POLICY "Members view organization"
ON public.organizations
FOR SELECT TO authenticated
USING ( public.is_org_member(organizations.id) );

/* UPDATE – owners & admins can update */
CREATE POLICY "Owners/Admins update organization"
ON public.organizations
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = organizations.id
      AND om.user_id = (SELECT auth.uid())
      AND om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = organizations.id
      AND om.user_id = (SELECT auth.uid())
      AND om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])
  )
);

/* DELETE – only owners can delete */
CREATE POLICY "Owner delete organization"
ON public.organizations
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = organizations.id
      AND om.user_id = (SELECT auth.uid())
      AND om.role = 'owner'::organization_role
  )
);

/* -------------------------------------------------
   Policies for "organization_members"
   ------------------------------------------------- */

/* SELECT – any member can see members of their org */
CREATE POLICY "Members view members"
ON public.organization_members
FOR SELECT TO authenticated
USING ( public.is_org_member(organization_members.organization_id) );

/* INSERT – owners & admins can add members (cannot create a second owner) */
CREATE POLICY "Owners/Admins insert member"
ON public.organization_members
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = organization_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])
  )
  AND NOT (
    role = 'owner'::organization_role
    AND (
      SELECT COUNT(*) FROM public.organization_members om2
      WHERE om2.organization_id = organization_id
        AND om2.role = 'owner'::organization_role
    ) >= 1
  )
);

/* UPDATE – owners & admins can modify rows (cannot demote the last owner) */
CREATE POLICY "Owners/Admins update member"
ON public.organization_members
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])
  )
  AND NOT (
    organization_members.role = 'owner'::organization_role
    AND (
      SELECT COUNT(*) FROM public.organization_members om2
      WHERE om2.organization_id = organization_members.organization_id
        AND om2.role = 'owner'::organization_role
    ) <= 1
  )
);

/* DELETE – owners & admins can delete membership rows */
CREATE POLICY "Owners/Admins delete member"
ON public.organization_members
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])
  )
);

/* -------------------------------------------------
   Policies for "invites"
   ------------------------------------------------- */

/* INSERT – owners & admins can create invites */
CREATE POLICY "Owners/Admins create invite"
ON public.invites
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = invites.organization_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])
  )
);

/* SELECT – invite creator, owners & admins can view */
CREATE POLICY "Invite viewer (owner/admin/creator)"
ON public.invites
FOR SELECT TO authenticated
USING (
  (SELECT auth.uid()) = invited_by
  OR EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = invites.organization_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])
  )
);

/* DELETE – owners & admins can delete invites */
CREATE POLICY "Owners/Admins delete invite"
ON public.invites
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = invites.organization_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])
  )
);