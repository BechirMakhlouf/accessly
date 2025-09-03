alter table "public"."user_profiles" add column "email" text not null default auth.email();

CREATE UNIQUE INDEX user_profiles_email_key ON public.user_profiles USING btree (email);

alter table "public"."user_profiles" add constraint "user_profiles_email_key" UNIQUE using index "user_profiles_email_key";

set check_function_bodies = off;

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
  WHERE id = NEW.id;

  -- Update user settings updated_at timestamp
  UPDATE public.user_settings 
  SET updated_at = now()
  WHERE id = NEW.id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error updating user records: %', SQLERRM;
    RETURN NEW;
END;
$function$
;


