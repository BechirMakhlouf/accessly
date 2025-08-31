CREATE OR REPLACE FUNCTION public.is_organization_slugunique(p_slug text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  -- Return true if no organization already uses the given slug
  RETURN NOT EXISTS (
    SELECT 1 FROM public.organizations WHERE slug = p_slug
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_unique_organization_slug(p_name text)
RETURNS text
LANGUAGE plpgsql
VOLATILE                -- because the result can change when rows are added/removed
SECURITY DEFINER        -- runs with the function owner’s privileges (useful if RLS blocks anon reads)
AS $$
DECLARE
    base_slug text;
    candidate  text;
    suffix     int := 0;
BEGIN
    -------------------------------------------------------------------------
    -- 1️⃣  Slugify the incoming name
    -------------------------------------------------------------------------
    base_slug := lower(trim(p_name));                                 -- lower‑case & trim
    base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');    -- non‑alnum → hyphen
    base_slug := regexp_replace(base_slug, '(^-+)|(-+$)', '', 'g');    -- strip leading/trailing hyphens

    candidate := base_slug;                                            -- first try

    -------------------------------------------------------------------------
    -- 2️⃣  Loop until we find a slug that does **not** exist
    -------------------------------------------------------------------------
    WHILE EXISTS (SELECT 1 FROM public.organizations WHERE slug = candidate) LOOP
        suffix    := suffix + 1;
        candidate := base_slug || '-' || suffix;
    END LOOP;

    RETURN candidate;
END;
$$;

-- Function to add the creating user as an owner in organization_members
CREATE OR REPLACE FUNCTION public.add_owner_to_organization()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'owner');
    RETURN NEW;
END;
$$;

