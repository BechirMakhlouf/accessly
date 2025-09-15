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

-- ensure gen_random_uuid() is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- simple slug generator: only takes the title
CREATE OR REPLACE FUNCTION public.generate_board_slug(p_title text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  short_id  text;
BEGIN
  -- slugify the title
  base_slug := lower(trim(coalesce(p_title, 'board')));
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '(^-+)|(-+$)', '', 'g');

  -- if slug is free → return it
  IF NOT EXISTS (
    SELECT 1 FROM public.boards WHERE slug = base_slug
  ) THEN
    RETURN base_slug;
  END IF;

  -- otherwise append first segment of random UUID and return
  short_id := split_part(gen_random_uuid()::text, '-', 1);
  RETURN base_slug || '-' || short_id;
END;
$$;

-- trigger function: sets NEW.slug when empty/null before insert
CREATE OR REPLACE FUNCTION public.set_board_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    NEW.slug := public.generate_board_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;

-- create trigger (drop if exists to avoid duplicates)
DROP TRIGGER IF EXISTS set_board_slug_trigger ON public.boards;
CREATE TRIGGER set_board_slug_trigger
BEFORE INSERT ON public.boards
FOR EACH ROW
EXECUTE FUNCTION public.set_board_slug();

