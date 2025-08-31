drop policy "Users can create invites for their organizations" on "public"."invites";

drop policy "Users can view invites for their organizations" on "public"."invites";

drop policy "Admins and owners can manage membership" on "public"."organization_members";

drop policy "Members can view their organization's members" on "public"."organization_members";

drop policy "Only organization owners can delete organization" on "public"."organizations";

drop policy "Organization owners and admins can update organization" on "public"."organizations";

drop policy "Users can view organizations they are members of" on "public"."organizations";

drop policy "Users can view own profile" on "public"."user_profiles";

drop policy "Users can insert own profile" on "public"."user_profiles";

drop policy "Users can update own profile" on "public"."user_profiles";

drop policy "Users can update their own settings" on "public"."user_settings";

drop index if exists "public"."idx_invites_organization_id";

drop index if exists "public"."idx_organization_members_org_id";

drop index if exists "public"."idx_organization_members_user_id";

CREATE INDEX idx_invites_invited_by ON public.invites USING btree (invited_by);

CREATE INDEX idx_invites_org ON public.invites USING btree (organization_id);

CREATE INDEX idx_om_org_owner_admin ON public.organization_members USING btree (organization_id, user_id) WHERE (role = ANY ('{owner,admin}'::organization_role[]));

CREATE INDEX idx_om_org_user ON public.organization_members USING btree (organization_id, user_id);

CREATE INDEX idx_om_user ON public.organization_members USING btree (user_id);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_owner_to_organization()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'owner');
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_unique_organization_slug(p_name text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    base_slug text;
    candidate  text;
    suffix     int := 0;
BEGIN
    -------------------------------------------------------------------------
    -- 1️⃣  Slugify the incoming name
    -------------------------------------------------------------------------
    base_slug := lower(trim(p_name));                                 -- lower‑case & trim
    base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');    -- non‑alnum → hyphen
    base_slug := regexp_replace(base_slug, '(^-+)|(-+$)', '', 'g');    -- strip leading/trailing hyphens

    candidate := base_slug;                                            -- first try

    -------------------------------------------------------------------------
    -- 2️⃣  Loop until we find a slug that does **not** exist
    -------------------------------------------------------------------------
    WHILE EXISTS (SELECT 1 FROM public.organizations WHERE slug = candidate) LOOP
        suffix    := suffix + 1;
        candidate := base_slug || '-' || suffix;
    END LOOP;

    RETURN candidate;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_org_member(org_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = org_id
      AND om.user_id = (SELECT auth.uid())
  );
$function$
;

CREATE OR REPLACE FUNCTION public.is_organization_slugunique(p_slug text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
  -- Return true if no organization already uses the given slug
  RETURN NOT EXISTS (
    SELECT 1 FROM public.organizations WHERE slug = p_slug
  );
END;
$function$
;

create policy "Invite viewer (owner/admin/creator)"
on "public"."invites"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = invited_by) OR (EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = invites.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])))))));


create policy "Owners/Admins create invite"
on "public"."invites"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = invites.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))));


create policy "Owners/Admins delete invite"
on "public"."invites"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = invites.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))));


create policy "Members view members"
on "public"."organization_members"
as permissive
for select
to authenticated
using (is_org_member(organization_id));


create policy "Owners/Admins delete member"
on "public"."organization_members"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organization_members.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))));


create policy "Owners/Admins insert member"
on "public"."organization_members"
as permissive
for insert
to authenticated
with check (((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = om.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))) AND (NOT ((role = 'owner'::organization_role) AND (( SELECT count(*) AS count
   FROM organization_members om2
  WHERE ((om2.organization_id = om2.organization_id) AND (om2.role = 'owner'::organization_role))) >= 1)))));


create policy "Owners/Admins update member"
on "public"."organization_members"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organization_members.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))))
with check (((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organization_members.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))) AND (NOT ((role = 'owner'::organization_role) AND (( SELECT count(*) AS count
   FROM organization_members om2
  WHERE ((om2.organization_id = organization_members.organization_id) AND (om2.role = 'owner'::organization_role))) <= 1)))));


create policy "Create own organization"
on "public"."organizations"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Members view organization"
on "public"."organizations"
as permissive
for select
to authenticated
using (is_org_member(id));


create policy "Owner delete organization"
on "public"."organizations"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'owner'::organization_role)))));


create policy "Owners/Admins update organization"
on "public"."organizations"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))))
with check ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))));


create policy "Users can view all profiles"
on "public"."user_profiles"
as permissive
for select
to anon, authenticated
using (true);


create policy "Users can insert own profile"
on "public"."user_profiles"
as permissive
for insert
to authenticated
with check (((( SELECT auth.uid() AS uid) = id) AND (id IS NOT NULL)));


create policy "Users can update own profile"
on "public"."user_profiles"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check (((( SELECT auth.uid() AS uid) = id) AND (id IS NULL) AND (created_at IS NULL)));


create policy "Users can update their own settings"
on "public"."user_settings"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check (((( SELECT auth.uid() AS uid) = id) AND (id IS NULL) AND (created_at IS NULL)));


CREATE TRIGGER trg_add_owner_to_organization AFTER INSERT ON public.organizations FOR EACH ROW EXECUTE FUNCTION add_owner_to_organization();


