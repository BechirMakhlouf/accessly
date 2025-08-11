CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
