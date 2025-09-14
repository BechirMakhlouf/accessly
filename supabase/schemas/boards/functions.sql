CREATE OR REPLACE FUNCTION public.add_creator_to_board()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.board_members(user_id, board_id, role, joined_at, created_at, updated_at)
  VALUES (NEW.created_by, NEW.id, 'admin'::boards_role, now(), now(), now());
  RETURN NEW;
END;
$$;

-- Generate a unique board slug from title and the first UUID segment of the board id
CREATE OR REPLACE FUNCTION public.generate_board_slug(p_title text, p_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  base_slug text;
  short_id  text;
  candidate text;
  suffix    int := 0;
BEGIN
-- Check if a board with the same title slug exists in the same org
base_slug := lower(trim(coalesce(p_title, 'board')));
base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
base_slug := regexp_replace(base_slug, '(^-+)|(-+$)', '', 'g');

IF NOT EXISTS (
  SELECT 1 FROM public.boards
  WHERE slug = base_slug AND org_id = (SELECT org_id FROM public.boards WHERE id = p_id)
) THEN
  RETURN base_slug;
END IF;
  -- slugify title
  base_slug := lower(trim(coalesce(p_title, 'board')));
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '(^-+)|(-+$)', '', 'g');

  -- take the first segment of UUID (before '-')
  short_id := split_part(p_id::text, '-', 1);

  candidate := base_slug || '-' || short_id;

  -- ensure uniqueness if someone manually sets same title and colliding id segment (rare)
  WHILE EXISTS (SELECT 1 FROM public.boards WHERE slug = candidate) LOOP
    suffix := suffix + 1;
    candidate := base_slug || '-' || short_id || '-' || suffix;
  END LOOP;

  RETURN candidate;
END;
$$;

-- Trigger function to set slug before insert
CREATE OR REPLACE FUNCTION public.set_board_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    NEW.slug := public.generate_board_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;
