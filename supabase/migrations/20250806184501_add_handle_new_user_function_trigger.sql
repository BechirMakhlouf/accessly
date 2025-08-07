set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  personal_team_id UUID;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NULL
  );

  -- Insert user settings
  INSERT INTO public.user_settings (user_id, display_name, theme, language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    'system',
    'en'
  );

  -- Create personal team
  INSERT INTO public.teams (id, name, description, created_by)
  VALUES (
    gen_random_uuid(),
    'Personal',
    'Your personal workspace',
    NEW.id
  ) RETURNING id INTO personal_team_id;

  -- Add user as admin to their personal team
  INSERT INTO public.team_members (user_id, team_id, role)
  VALUES (
    NEW.id,
    personal_team_id,
    'admin'
  );

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


