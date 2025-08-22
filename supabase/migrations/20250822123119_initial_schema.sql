create extension if not exists "moddatetime" with schema "extensions";

create type "public"."organization_role" as enum ('admin', 'member', 'owner');


  create table "public"."invites" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "invited_by" uuid not null,
    "invite_token" text not null,
    "email" text not null,
    "role" organization_role not null default 'member'::organization_role,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone not null default now(),
    "expires_at" timestamp with time zone not null default (now() + '7 days'::interval),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."invites" enable row level security;


  create table "public"."organization_members" (
    "user_id" uuid not null,
    "organization_id" uuid not null,
    "role" organization_role not null default 'member'::organization_role,
    "joined_at" timestamp with time zone not null default now(),
    "last_active_at" timestamp with time zone,
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
    "created_by" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."organizations" enable row level security;


  create table "public"."user_profiles" (
    "id" uuid not null,
    "full_name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."user_profiles" enable row level security;


  create table "public"."user_settings" (
    "id" uuid not null default auth.uid(),
    "theme" text not null default 'system'::text,
    "language" text not null default 'en'::text,
    "notifications_enabled" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."user_settings" enable row level security;

CREATE INDEX idx_invites_email ON public.invites USING btree (email);

CREATE INDEX idx_invites_organization_id ON public.invites USING btree (organization_id);

CREATE INDEX idx_organization_members_org_id ON public.organization_members USING btree (organization_id);

CREATE INDEX idx_organization_members_user_id ON public.organization_members USING btree (user_id);

CREATE INDEX idx_user_settings_id ON public.user_settings USING btree (id);

CREATE UNIQUE INDEX invites_invite_token_key ON public.invites USING btree (invite_token);

CREATE UNIQUE INDEX invites_pkey ON public.invites USING btree (id);

CREATE UNIQUE INDEX organization_members_pkey ON public.organization_members USING btree (user_id, organization_id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX organizations_slug_key ON public.organizations USING btree (slug);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (id);

alter table "public"."invites" add constraint "invites_pkey" PRIMARY KEY using index "invites_pkey";

alter table "public"."organization_members" add constraint "organization_members_pkey" PRIMARY KEY using index "organization_members_pkey";

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."invites" add constraint "invites_email_check" CHECK ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'::text)) not valid;

alter table "public"."invites" validate constraint "invites_email_check";

alter table "public"."invites" add constraint "invites_invite_token_key" UNIQUE using index "invites_invite_token_key";

alter table "public"."invites" add constraint "invites_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."invites" validate constraint "invites_invited_by_fkey";

alter table "public"."invites" add constraint "invites_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."invites" validate constraint "invites_organization_id_fkey";

alter table "public"."invites" add constraint "invites_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'expired'::text]))) not valid;

alter table "public"."invites" validate constraint "invites_status_check";

alter table "public"."organization_members" add constraint "organization_members_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_organization_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_user_id_fkey";

alter table "public"."organizations" add constraint "organizations_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."organizations" validate constraint "organizations_created_by_fkey";

alter table "public"."organizations" add constraint "organizations_name_check" CHECK (((length(name) >= 2) AND (length(name) <= 100))) not valid;

alter table "public"."organizations" validate constraint "organizations_name_check";

alter table "public"."organizations" add constraint "organizations_slug_key" UNIQUE using index "organizations_slug_key";

alter table "public"."user_profiles" add constraint "user_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_language_check" CHECK ((length(language) = 2)) not valid;

alter table "public"."user_settings" validate constraint "user_settings_language_check";

alter table "public"."user_settings" add constraint "user_settings_theme_check" CHECK ((theme = ANY (ARRAY['light'::text, 'dark'::text, 'system'::text]))) not valid;

alter table "public"."user_settings" validate constraint "user_settings_theme_check";

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
  INSERT INTO public.user_profiles (id)
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

grant delete on table "public"."invites" to "anon";

grant insert on table "public"."invites" to "anon";

grant references on table "public"."invites" to "anon";

grant select on table "public"."invites" to "anon";

grant trigger on table "public"."invites" to "anon";

grant truncate on table "public"."invites" to "anon";

grant update on table "public"."invites" to "anon";

grant delete on table "public"."invites" to "authenticated";

grant insert on table "public"."invites" to "authenticated";

grant references on table "public"."invites" to "authenticated";

grant select on table "public"."invites" to "authenticated";

grant trigger on table "public"."invites" to "authenticated";

grant truncate on table "public"."invites" to "authenticated";

grant update on table "public"."invites" to "authenticated";

grant delete on table "public"."invites" to "service_role";

grant insert on table "public"."invites" to "service_role";

grant references on table "public"."invites" to "service_role";

grant select on table "public"."invites" to "service_role";

grant trigger on table "public"."invites" to "service_role";

grant truncate on table "public"."invites" to "service_role";

grant update on table "public"."invites" to "service_role";

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

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";

grant delete on table "public"."user_settings" to "anon";

grant insert on table "public"."user_settings" to "anon";

grant references on table "public"."user_settings" to "anon";

grant select on table "public"."user_settings" to "anon";

grant trigger on table "public"."user_settings" to "anon";

grant truncate on table "public"."user_settings" to "anon";

grant update on table "public"."user_settings" to "anon";

grant delete on table "public"."user_settings" to "authenticated";

grant insert on table "public"."user_settings" to "authenticated";

grant references on table "public"."user_settings" to "authenticated";

grant select on table "public"."user_settings" to "authenticated";

grant trigger on table "public"."user_settings" to "authenticated";

grant truncate on table "public"."user_settings" to "authenticated";

grant update on table "public"."user_settings" to "authenticated";

grant delete on table "public"."user_settings" to "service_role";

grant insert on table "public"."user_settings" to "service_role";

grant references on table "public"."user_settings" to "service_role";

grant select on table "public"."user_settings" to "service_role";

grant trigger on table "public"."user_settings" to "service_role";

grant truncate on table "public"."user_settings" to "service_role";

grant update on table "public"."user_settings" to "service_role";


  create policy "Users can create invites for their organizations"
  on "public"."invites"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = invites.organization_id) AND (om.user_id = auth.uid()) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))));



  create policy "Users can view invites for their organizations"
  on "public"."invites"
  as permissive
  for select
  to public
using (((auth.uid() = invited_by) OR (EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = invites.organization_id) AND (om.user_id = auth.uid()) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role])))))));



  create policy "Admins and owners can manage membership"
  on "public"."organization_members"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organization_members.organization_id) AND (om.user_id = auth.uid()) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))))
with check ((NOT ((role = 'owner'::organization_role) AND (( SELECT count(*) AS count
   FROM organization_members organization_members_1
  WHERE ((organization_members_1.organization_id = organization_members_1.organization_id) AND (organization_members_1.role = 'owner'::organization_role))) <= 1))));



  create policy "Members can view their organization's members"
  on "public"."organization_members"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organization_members.organization_id) AND (om.user_id = auth.uid())))));



  create policy "Only organization owners can delete organization"
  on "public"."organizations"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = auth.uid()) AND (om.role = 'owner'::organization_role)))));



  create policy "Organization owners and admins can update organization"
  on "public"."organizations"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = auth.uid()) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))))
with check ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = auth.uid()) AND (om.role = ANY (ARRAY['owner'::organization_role, 'admin'::organization_role]))))));



  create policy "Users can view organizations they are members of"
  on "public"."organizations"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = auth.uid())))));



  create policy "Users can delete own profile"
  on "public"."user_profiles"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can insert own profile"
  on "public"."user_profiles"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can update own profile"
  on "public"."user_profiles"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can view own profile"
  on "public"."user_profiles"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can create their own settings"
  on "public"."user_settings"
  as permissive
  for insert
  to authenticated
with check (((( SELECT auth.uid() AS uid) = id) AND (id IS NOT NULL)));



  create policy "Users can delete their own settings"
  on "public"."user_settings"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can update their own settings"
  on "public"."user_settings"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can view their own settings"
  on "public"."user_settings"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));


CREATE TRIGGER handle_updated_at_invites BEFORE UPDATE ON public.invites FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at_members BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at_organizations BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER update_user_profiles_modtime BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

  create policy "Users can delete own avatars"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));



  create policy "Users can update own avatars"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))))
with check (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));



  create policy "Users can upload own avatars"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));



  create policy "Users can view own avatars"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));



