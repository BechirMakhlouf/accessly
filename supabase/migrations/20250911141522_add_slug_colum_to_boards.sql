alter table "public"."boards" add column "slug" text not null default ''::text;

CREATE UNIQUE INDEX boards_slug_key ON public.boards USING btree (slug);

alter table "public"."boards" add constraint "boards_slug_key" UNIQUE using index "boards_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_board_slug(p_title text, p_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  base_slug text;
  short_id  text;
  candidate text;
  suffix    int := 0;
BEGIN
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
$function$
;

CREATE OR REPLACE FUNCTION public.set_board_slug()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    NEW.slug := public.generate_board_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER trg_set_board_slug BEFORE INSERT ON public.boards FOR EACH ROW EXECUTE FUNCTION set_board_slug();


