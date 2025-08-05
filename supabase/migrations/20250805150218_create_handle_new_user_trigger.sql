set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NULL
  );

  INSERT INTO public.user_settings (user_id, display_name, theme, language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    'system',
    'en'
  );
  INSERT INTO public.teams (id, name, description, created_by)
  VALUES (
    gen_random_uuid(),
    'Personal',
    'Your personal workspace',
    NEW.id
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating user records: %', SQLERRM;
    RETURN NEW;
END;
$function$
;


