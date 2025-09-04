CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER                -- runs with the owner’s privileges
AS $$
DECLARE
  personal_organization_id UUID;
  metadata                  jsonb;
  full_name                 text;
  avatar_url                text;
  first_name                text;
  last_name                 text;
  candidate_url             text;
BEGIN
  ------------------------------------------------------------------
  -- Insert a row into user_settings (id = user’s UUID)
  ------------------------------------------------------------------
  INSERT INTO public.user_settings (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;   -- avoid duplicate‑key errors

  ------------------------------------------------------------------
  -- Build a profile record from the OAuth metadata
  ------------------------------------------------------------------
  metadata := COALESCE(NEW.raw_user_meta_data::jsonb, '{}'::jsonb);

  full_name := COALESCE(
    NULLIF(BTRIM(metadata->>'full_name'), ''),
    NULLIF(BTRIM(metadata->>'name'), ''),
    NULLIF(BTRIM(metadata->>'display_name'), ''),
    NULLIF(BTRIM(metadata->>'preferred_username'), ''),
    NULLIF(BTRIM(metadata->>'given_name'), ''),
    NULLIF(BTRIM(metadata->>'family_name'), '')
  );

  IF full_name IS NULL THEN
    first_name := COALESCE(
      NULLIF(BTRIM(metadata->>'given_name'), ''),
      NULLIF(BTRIM(metadata->>'first_name'), ''),
      NULLIF(BTRIM(metadata->>'firstname'), '')
    );
    last_name  := COALESCE(
      NULLIF(BTRIM(metadata->>'family_name'), ''),
      NULLIF(BTRIM(metadata->>'last_name'), ''),
      NULLIF(BTRIM(metadata->>'lastname'), '')
    );

    IF first_name IS NOT NULL AND last_name IS NOT NULL THEN
      full_name := BTRIM(first_name || ' ' || last_name);
    ELSIF first_name IS NOT NULL THEN
      full_name := first_name;
    ELSIF last_name IS NOT NULL THEN
      full_name := last_name;
    END IF;
  END IF;

  IF full_name IS NULL AND NEW.email IS NOT NULL THEN
    full_name := NULLIF(BTRIM(SPLIT_PART(NEW.email, '@', 1)), '');
  END IF;

  candidate_url := COALESCE(
    NULLIF(BTRIM(metadata->>'avatar_url'), ''),
    NULLIF(BTRIM(metadata->>'picture'), ''),
    NULLIF(BTRIM(metadata->>'photo'), ''),
    NULLIF(BTRIM(metadata->>'profile_picture'), ''),
    NULLIF(BTRIM(metadata->>'image'), ''),
    NULLIF(BTRIM(metadata->>'profile_image'), '')
  );

  IF candidate_url IS NOT NULL
     AND (candidate_url LIKE 'https://%') THEN
    avatar_url := candidate_url;
  ELSE
    avatar_url := NULL;
  END IF;

  ------------------------------------------------------------------
  -- Insert (or skip) the profile row
  ------------------------------------------------------------------
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    (SELECT auth.email()),   -- safe, works even when trigger runs as service_role
    full_name,
    avatar_url
  )
  ON CONFLICT (id) DO NOTHING;
  ------------------------------------------------------------------
  -- OPTIONAL: create a personal organization for the user
  ------------------------------------------------------------------
  /*
  INSERT INTO public.organizations (name, description, created_by, owned_by)
  VALUES ('My organization', '', NEW.id, NEW.id)
  RETURNING id INTO personal_organization_id;

  INSERT INTO public.organization_members (user_id, organization_id, role)
  VALUES (NEW.id, personal_organization_id, 'admin')
  ON CONFLICT DO NOTHING;
  */

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
