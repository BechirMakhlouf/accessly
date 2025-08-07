CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
  );

  -- Create personal team
  INSERT INTO public.teams (name, description, created_by, owned_by)
  VALUES (
    'My Team',
    '',
    NEW.id,
    NEW.id,
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
$$;

-- Trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
