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
  -- 1️⃣ Insert a row into user_settings (id = user's UUID)
  INSERT INTO public.user_settings (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;   -- avoid duplicate‑key errors

  -- Use the email from the newly inserted auth.users row
  new_email := NEW.email;

  -- 2️⃣ Derive a full_name from the email address if it isn't supplied
  IF new_email IS NOT NULL THEN
    full_name := NULLIF(BTRIM(SPLIT_PART(new_email, '@', 1), ''), '');
  ELSE
    full_name := NULL;
  END IF;

  -- 3️⃣ Insert a row into user_profiles
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, new_email, full_name)
  ON CONFLICT (id) DO NOTHING;

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


