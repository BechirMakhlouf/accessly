CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  personal_organization_id UUID;
  metadata jsonb;
  full_name text;
  avatar_url text;
  first_name text;
  last_name text;
  candidate_url text;
BEGIN
  -- Insert user settings
  INSERT INTO public.user_settings (id)
  VALUES (
    NEW.id
  );

  -- Insert user profile
  -- Extract metadata-based fields (name, avatar) from OAuth providers
  metadata := COALESCE(NEW.raw_user_meta_data::jsonb, '{}'::jsonb);

  -- Try to resolve a full name from common OAuth metadata fields
  full_name := COALESCE(
    NULLIF(BTRIM(metadata->>'full_name'), ''),
    NULLIF(BTRIM(metadata->>'name'), ''),
    NULLIF(BTRIM(metadata->>'display_name'), ''),
    NULLIF(BTRIM(metadata->>'preferred_username'), ''),
    NULLIF(BTRIM(metadata->>'given_name'), ''),
    NULLIF(BTRIM(metadata->>'family_name'), '')
  );

  -- If no full name, try to construct from first and last name
  first_name := COALESCE(
    NULLIF(BTRIM(metadata->>'given_name'), ''),
    NULLIF(BTRIM(metadata->>'first_name'), ''),
    NULLIF(BTRIM(metadata->>'firstname'), '')
  );

  last_name := COALESCE(
    NULLIF(BTRIM(metadata->>'family_name'), ''),
    NULLIF(BTRIM(metadata->>'last_name'), ''),
    NULLIF(BTRIM(metadata->>'lastname'), '')
  );

  IF full_name IS NULL THEN
    IF first_name IS NOT NULL AND last_name IS NOT NULL THEN
      full_name := BTRIM(first_name || ' ' || last_name);
    ELSIF first_name IS NOT NULL THEN
      full_name := first_name;
    ELSIF last_name IS NOT NULL THEN
      full_name := last_name;
    END IF;
  END IF;

  -- If still no name, fallback to local-part of email
  IF full_name IS NULL AND NEW.email IS NOT NULL THEN
    full_name := NULLIF(BTRIM(SPLIT_PART(NEW.email, '@', 1)), '');
  END IF;

  -- Try to resolve avatar URL from common OAuth metadata fields
  candidate_url := COALESCE(
    NULLIF(BTRIM(metadata->>'avatar_url'), ''),
    NULLIF(BTRIM(metadata->>'picture'), ''),
    NULLIF(BTRIM(metadata->>'photo'), ''),
    NULLIF(BTRIM(metadata->>'profile_picture'), ''),
    NULLIF(BTRIM(metadata->>'image'), ''),
    NULLIF(BTRIM(metadata->>'profile_image'), '')
  );

  IF candidate_url IS NOT NULL AND (candidate_url LIKE 'http://%' OR candidate_url LIKE 'https://%') THEN
    avatar_url := candidate_url;
  ELSE
    avatar_url := NULL;
  END IF;

  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    auth.email(),
    full_name,
    avatar_url
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
