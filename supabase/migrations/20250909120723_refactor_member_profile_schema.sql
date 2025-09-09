drop policy "Users can delete own profile" on "public"."user_profiles";

drop policy "Users can insert own profile" on "public"."user_profiles";

drop policy "Users can update own profile" on "public"."user_profiles";

drop policy "Users can view all profiles" on "public"."user_profiles";

drop policy "Users can create their own settings" on "public"."user_settings";

drop policy "Users can delete their own settings" on "public"."user_settings";

drop policy "Users can update their own settings" on "public"."user_settings";

drop policy "Users can view their own settings" on "public"."user_settings";

alter table "public"."user_profiles" drop constraint "user_profiles_id_fkey";

alter table "public"."user_settings" drop constraint "user_settings_id_fkey";

alter table "public"."organization_members" drop constraint "organization_members_user_id_fkey";

alter table "public"."user_profiles" drop constraint "user_profiles_pkey";

alter table "public"."user_settings" drop constraint "user_settings_pkey";

drop index if exists "public"."idx_user_settings_id";

drop index if exists "public"."user_profiles_pkey";

drop index if exists "public"."user_settings_pkey";

alter table "public"."user_profiles" drop column "id";

alter table "public"."user_profiles" add column "user_id" uuid not null default auth.uid();

alter table "public"."user_settings" drop column "id";

alter table "public"."user_settings" add column "user_id" uuid not null default auth.uid();

CREATE INDEX idx_user_settings_id ON public.user_settings USING btree (user_id);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (user_id);

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (user_id);

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_user_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_user_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  full_name text;
  new_email text;
BEGIN
  -- 1️⃣ Insert a row into user_settings (user_id = user's UUID)
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;   -- avoid duplicate‑key errors

  -- Use the email from the newly inserted auth.users row
  new_email := NEW.email;

  -- 2️⃣ Derive a full_name from the email address if it isn't supplied
  IF new_email IS NOT NULL THEN
    full_name := NULLIF(BTRIM(SPLIT_PART(new_email, '@', 1), ''), '');
  ELSE
    full_name := NULL;
  END IF;

  -- 3️⃣ Insert a row into user_profiles
  INSERT INTO public.user_profiles (user_id, email, full_name)
  VALUES (NEW.id, new_email, full_name)
  ON CONFLICT (user_id) DO NOTHING;

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

CREATE OR REPLACE FUNCTION public.handle_update_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Update user profile email to keep it in sync with auth.users
  UPDATE public.user_profiles 
  SET 
    email = NEW.email,
    updated_at = now()
  WHERE user_id = NEW.id;
  -- Update user settings updated_at timestamp
  UPDATE public.user_settings 
  SET updated_at = now()
  WHERE user_id = NEW.id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error updating user records: %', SQLERRM;
    RETURN NEW;
END;
$function$
;

create policy "Users can delete own profile"
on "public"."user_profiles"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can insert own profile"
on "public"."user_profiles"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update own profile"
on "public"."user_profiles"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can view all profiles"
on "public"."user_profiles"
as permissive
for select
to authenticated
using (true);


create policy "Users can create their own settings"
on "public"."user_settings"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can delete their own settings"
on "public"."user_settings"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update their own settings"
on "public"."user_settings"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can view their own settings"
on "public"."user_settings"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



