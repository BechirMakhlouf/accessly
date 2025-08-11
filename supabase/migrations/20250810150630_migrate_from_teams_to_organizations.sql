create type "public"."organization_role" as enum ('admin', 'member');

drop trigger if exists "handle_updated_at_members" on "public"."team_members";

drop trigger if exists "handle_updated_at_teams" on "public"."teams";

drop policy "Admins can delete team membership" on "public"."team_members";

drop policy "Admins can update team membership" on "public"."team_members";

drop policy "Team members can view membership" on "public"."team_members";

drop policy "Only team admins can delete team" on "public"."teams";

drop policy "Only team admins can update team" on "public"."teams";

drop policy "Users can view their own team" on "public"."teams";

drop policy "Users can delete their settings" on "public"."user_settings";

drop policy "Users can insert their own settings" on "public"."user_settings";

drop policy "Users can select their settings" on "public"."user_settings";

drop policy "Users can update their settings" on "public"."user_settings";

revoke delete on table "public"."team_members" from "anon";

revoke insert on table "public"."team_members" from "anon";

revoke references on table "public"."team_members" from "anon";

revoke select on table "public"."team_members" from "anon";

revoke trigger on table "public"."team_members" from "anon";

revoke truncate on table "public"."team_members" from "anon";

revoke update on table "public"."team_members" from "anon";

revoke delete on table "public"."team_members" from "authenticated";

revoke insert on table "public"."team_members" from "authenticated";

revoke references on table "public"."team_members" from "authenticated";

revoke select on table "public"."team_members" from "authenticated";

revoke trigger on table "public"."team_members" from "authenticated";

revoke truncate on table "public"."team_members" from "authenticated";

revoke update on table "public"."team_members" from "authenticated";

revoke delete on table "public"."team_members" from "service_role";

revoke insert on table "public"."team_members" from "service_role";

revoke references on table "public"."team_members" from "service_role";

revoke select on table "public"."team_members" from "service_role";

revoke trigger on table "public"."team_members" from "service_role";

revoke truncate on table "public"."team_members" from "service_role";

revoke update on table "public"."team_members" from "service_role";

revoke delete on table "public"."teams" from "anon";

revoke insert on table "public"."teams" from "anon";

revoke references on table "public"."teams" from "anon";

revoke select on table "public"."teams" from "anon";

revoke trigger on table "public"."teams" from "anon";

revoke truncate on table "public"."teams" from "anon";

revoke update on table "public"."teams" from "anon";

revoke delete on table "public"."teams" from "authenticated";

revoke insert on table "public"."teams" from "authenticated";

revoke references on table "public"."teams" from "authenticated";

revoke select on table "public"."teams" from "authenticated";

revoke trigger on table "public"."teams" from "authenticated";

revoke truncate on table "public"."teams" from "authenticated";

revoke update on table "public"."teams" from "authenticated";

revoke delete on table "public"."teams" from "service_role";

revoke insert on table "public"."teams" from "service_role";

revoke references on table "public"."teams" from "service_role";

revoke select on table "public"."teams" from "service_role";

revoke trigger on table "public"."teams" from "service_role";

revoke truncate on table "public"."teams" from "service_role";

revoke update on table "public"."teams" from "service_role";

alter table "public"."invites" drop constraint "invites_team_id_fkey";

alter table "public"."team_members" drop constraint "team_members_team_id_fkey";

alter table "public"."team_members" drop constraint "team_members_user_id_fkey";

alter table "public"."user_settings" drop constraint "user_settings_user_id_fkey";

alter table "public"."team_members" drop constraint "team_members_pkey";

alter table "public"."teams" drop constraint "teams_pkey";

alter table "public"."user_settings" drop constraint "user_settings_pkey";

drop index if exists "public"."team_members_pkey";

drop index if exists "public"."teams_pkey";

drop index if exists "public"."user_settings_pkey";

drop table "public"."team_members";

drop table "public"."teams";

create table "public"."organization_members" (
    "user_id" uuid not null,
    "organization_id" uuid not null,
    "role" organization_role not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."organization_members" enable row level security;

create table "public"."organizations" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "name" text not null,
    "description" text,
    "icon_url" text,
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."organizations" enable row level security;

alter table "public"."invites" drop column "team_id";

alter table "public"."invites" add column "organization_id" uuid not null;

alter table "public"."profiles" alter column "full_name" drop not null;

alter table "public"."user_settings" drop column "display_name";

alter table "public"."user_settings" drop column "user_id";

alter table "public"."user_settings" add column "id" uuid not null;

drop type "public"."team_role";

CREATE UNIQUE INDEX organization_members_pkey ON public.organization_members USING btree (user_id, organization_id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX organizations_slug_key ON public.organizations USING btree (slug);

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (id);

alter table "public"."organization_members" add constraint "organization_members_pkey" PRIMARY KEY using index "organization_members_pkey";

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."invites" add constraint "invites_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid;

alter table "public"."invites" validate constraint "invites_organization_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_organization_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_user_id_fkey";

alter table "public"."organizations" add constraint "organizations_slug_key" UNIQUE using index "organizations_slug_key";

alter table "public"."user_settings" add constraint "user_settings_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  personal_organization_id UUID;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id)
  VALUES (
    NEW.id
  );

  -- Insert user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (
    NEW.id
  );

  -- -- Create personal organization
  -- INSERT INTO public.organizations (name, description, created_by, owned_by)
  -- VALUES (
  --   'My organization',
  --   '',
  --   NEW.id,
  --   NEW.id,
  -- ) RETURNING id INTO personal_organization_id;
  --
  -- -- Add user as admin to their personal organization
  -- INSERT INTO public.organization_members (user_id, team_id, role)
  -- VALUES (
  --   NEW.id,
  --   personal_organization_id,
  --   'admin'
  -- );

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RAISE WARNING 'Duplicate record for user %', NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating user records: %', SQLERRM;
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."organization_members" to "anon";

grant insert on table "public"."organization_members" to "anon";

grant references on table "public"."organization_members" to "anon";

grant select on table "public"."organization_members" to "anon";

grant trigger on table "public"."organization_members" to "anon";

grant truncate on table "public"."organization_members" to "anon";

grant update on table "public"."organization_members" to "anon";

grant delete on table "public"."organization_members" to "authenticated";

grant insert on table "public"."organization_members" to "authenticated";

grant references on table "public"."organization_members" to "authenticated";

grant select on table "public"."organization_members" to "authenticated";

grant trigger on table "public"."organization_members" to "authenticated";

grant truncate on table "public"."organization_members" to "authenticated";

grant update on table "public"."organization_members" to "authenticated";

grant delete on table "public"."organization_members" to "service_role";

grant insert on table "public"."organization_members" to "service_role";

grant references on table "public"."organization_members" to "service_role";

grant select on table "public"."organization_members" to "service_role";

grant trigger on table "public"."organization_members" to "service_role";

grant truncate on table "public"."organization_members" to "service_role";

grant update on table "public"."organization_members" to "service_role";

grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "authenticated";

grant insert on table "public"."organizations" to "authenticated";

grant references on table "public"."organizations" to "authenticated";

grant select on table "public"."organizations" to "authenticated";

grant trigger on table "public"."organizations" to "authenticated";

grant truncate on table "public"."organizations" to "authenticated";

grant update on table "public"."organizations" to "authenticated";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

create policy "Admins can delete organization membership"
on "public"."organization_members"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM organization_members tm
  WHERE ((tm.user_id = auth.uid()) AND (tm.organization_id = organization_members.organization_id) AND (tm.role = 'admin'::organization_role)))));


create policy "Admins can update organization membership"
on "public"."organization_members"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM organization_members tm
  WHERE ((tm.user_id = auth.uid()) AND (tm.organization_id = organization_members.organization_id) AND (tm.role = 'admin'::organization_role)))));


create policy "organization members can view membership"
on "public"."organization_members"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM organization_members tm
  WHERE ((tm.user_id = auth.uid()) AND (tm.organization_id = organization_members.organization_id)))));


create policy "Only organization admins can delete organization"
on "public"."organizations"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.organization_id = organizations.id) AND (organization_members.role = 'admin'::organization_role)))));


create policy "Only organization admins can update organization"
on "public"."organizations"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM organization_members
  WHERE ((organization_members.user_id = auth.uid()) AND (organization_members.organization_id = organizations.id) AND (organization_members.role = 'admin'::organization_role)))));


create policy "Users can view their own organization"
on "public"."organizations"
as permissive
for select
to public
using ((auth.uid() = created_by));


create policy "Users can delete their settings"
on "public"."user_settings"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = id));


create policy "Users can insert their own settings"
on "public"."user_settings"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = id));


create policy "Users can select their settings"
on "public"."user_settings"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = id));


create policy "Users can update their settings"
on "public"."user_settings"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = id));


CREATE TRIGGER handle_updated_at_members BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at_organizations BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


