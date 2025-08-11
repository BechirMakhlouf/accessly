alter table "public"."invites" drop constraint "invites_invited_by_fkey";

alter table "public"."organization_members" alter column "role" set default 'member'::organization_role;


