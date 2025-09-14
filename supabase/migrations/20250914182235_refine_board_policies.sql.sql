alter table "public"."boards" drop constraint "boards_slug_key";

drop index if exists "public"."boards_slug_key";

alter table "public"."boards" alter column "slug" drop default;

CREATE UNIQUE INDEX boards_organization_id_slug_key ON public.boards USING btree (organization_id, slug);

alter table "public"."boards" add constraint "boards_organization_id_slug_key" UNIQUE using index "boards_organization_id_slug_key";

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
$function$
;

create policy "Board creator self membership"
on "public"."board_members"
as permissive
for insert
to authenticated
with check (((user_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM boards b
  WHERE ((b.id = board_members.board_id) AND (b.created_by = ( SELECT auth.uid() AS uid)))))));


create policy "Org member create board"
on "public"."boards"
as permissive
for insert
to authenticated
with check (((created_by = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM organization_members om
  WHERE ((om.organization_id = boards.organization_id) AND (om.user_id = ( SELECT auth.uid() AS uid)))))));



