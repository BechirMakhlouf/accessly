create type "public"."org_invite_status" as enum ('pending', 'accepted', 'rejected', 'revoked');

drop policy "Invite viewer (admin/creator)" on "public"."invites";

drop policy "Members view organization" on "public"."organizations";

alter table "public"."invites" drop constraint "invites_status_check";

alter table "public"."invites" drop constraint "invites_invited_by_fkey";

alter table "public"."invites" alter column "status" set default 'pending'::org_invite_status;

alter table "public"."invites" alter column "status" set data type org_invite_status using "status"::org_invite_status;

CREATE UNIQUE INDEX idx_invites_unique_pending ON public.invites USING btree (organization_id, email) WHERE (status = 'pending'::org_invite_status);

alter table "public"."invites" add constraint "invites_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."invites" validate constraint "invites_invited_by_fkey";

create policy "Invite viewer (admin/creator/invitee)"
on "public"."invites"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = invited_by) OR (EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = invites.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)) AND (om.role = 'admin'::organization_role)))) OR (( SELECT auth.email() AS email) = email)));


create policy "Members view organization"
on "public"."organizations"
as permissive
for select
to authenticated
using ((is_org_member(id) OR (EXISTS ( SELECT 1
   FROM invites
  WHERE (auth.email() = invites.email)))));



