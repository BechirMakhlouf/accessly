alter table "public"."boards" add column "slug" text not null;

alter table "public"."boards" alter column "created_by" set default auth.uid();

CREATE UNIQUE INDEX boards_organization_id_slug_key ON public.boards USING btree (organization_id, slug);

alter table "public"."boards" add constraint "boards_organization_id_slug_key" UNIQUE using index "boards_organization_id_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_board_slug(p_title text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.set_board_slug()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    NEW.slug := public.generate_board_slug(NEW.title);
  END IF;
  RETURN NEW;
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
  WHERE ((om.organization_id = boards.organization_id) AND (om.role = 'admin'::organization_role) AND (om.user_id = ( SELECT auth.uid() AS uid)))))));


CREATE TRIGGER set_board_slug_trigger BEFORE INSERT ON public.boards FOR EACH ROW EXECUTE FUNCTION set_board_slug();

CREATE TRIGGER trg_set_board_slug BEFORE INSERT ON public.boards FOR EACH ROW EXECUTE FUNCTION set_board_slug();


