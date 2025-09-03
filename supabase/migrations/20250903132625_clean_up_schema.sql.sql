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
  INSERT INTO public.user_settings (id)
  VALUES (
    NEW.id
  );

  -- Insert user profile
  INSERT INTO public.user_profiles (id, email)
  VALUES (
    NEW.id,
    NEW.email
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


