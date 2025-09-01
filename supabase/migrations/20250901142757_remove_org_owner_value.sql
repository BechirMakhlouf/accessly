drop trigger if exists "trg_add_owner_to_organization" on "public"."organizations";

drop policy "Invite viewer (owner/admin/creator)" on "public"."invites";

drop policy "Owners/Admins create invite" on "public"."invites";

drop policy "Owners/Admins delete invite" on "public"."invites";

drop policy "Owners/Admins delete member" on "public"."organization_members";

drop policy "Owners/Admins insert member" on "public"."organization_members";

drop policy "Owners/Admins update member" on "public"."organization_members";

drop policy "Owner delete organization" on "public"."organizations";

drop policy "Owners/Admins update organization" on "public"."organizations";

drop function if exists "public"."add_owner_to_organization"();

drop index if exists "public"."idx_om_org_owner_admin";

alter table "public"."invites" alter column "role" drop default;

alter table "public"."organization_members" alter column "role" drop default;

alter type "public"."organization_role" rename to "organization_role__old_version_to_be_dropped";

create type "public"."organization_role" as enum ('admin', 'member');

alter table "public"."invites" alter column role type "public"."organization_role" using role::text::"public"."organization_role";

alter table "public"."organization_members" alter column role type "public"."organization_role" using role::text::"public"."organization_role";

alter table "public"."invites" alter column "role" set default 'member'::organization_role;

alter table "public"."organization_members" alter column "role" set default 'member'::organization_role;

drop type "public"."organization_role__old_version_to_be_dropped";

CREATE INDEX idx_om_org_admin ON public.organization_members USING btree (organization_id, user_id) WHERE (role = 'admin'::organization_role);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_creator_to_organization()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'admin');
    RETURN NEW;
END;
$function$
;

create policy "Admins create invite"
on "public"."invites"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = invites.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role)))));


create policy "Admins delete invite"
on "public"."invites"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = invites.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role)))));


create policy "Invite viewer (admin/creator)"
on "public"."invites"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = invited_by) OR (EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = invites.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role))))));


create policy "Admins delete member"
on "public"."organization_members"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organization_members.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role)))));


create policy "Admins insert member"
on "public"."organization_members"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = om.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role)))));


create policy "Admins update member"
on "public"."organization_members"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organization_members.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role)))))
with check ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organization_members.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role)))));


create policy "Admin delete organization"
on "public"."organizations"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role)))));


create policy "Admins update organization"
on "public"."organizations"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role)))))
with check ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role)))));


CREATE TRIGGER trg_add_creator_to_organization AFTER INSERT ON public.organizations FOR EACH ROW EXECUTE FUNCTION add_creator_to_organization();


