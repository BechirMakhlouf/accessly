create type "public"."boards_role" as enum ('admin', 'member');

create type "public"."boards_visibility" as enum ('public', 'private');

create table "public"."board_members" (
    "user_id" uuid not null,
    "board_id" uuid not null,
    "role" boards_role not null default 'member'::boards_role,
    "joined_at" timestamp with time zone not null default now(),
    "last_active_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."board_members" enable row level security;

create table "public"."boards" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "title" text not null,
    "description" text,
    "icon_url" text,
    "visibility" boards_visibility not null default 'public'::boards_visibility,
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."boards" enable row level security;

CREATE UNIQUE INDEX board_members_pkey ON public.board_members USING btree (user_id, board_id);

CREATE UNIQUE INDEX boards_pkey ON public.boards USING btree (id);

alter table "public"."board_members" add constraint "board_members_pkey" PRIMARY KEY using index "board_members_pkey";

alter table "public"."boards" add constraint "boards_pkey" PRIMARY KEY using index "boards_pkey";

alter table "public"."board_members" add constraint "board_members_board_id_fkey" FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE not valid;

alter table "public"."board_members" validate constraint "board_members_board_id_fkey";

alter table "public"."board_members" add constraint "board_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."board_members" validate constraint "board_members_user_id_fkey";

alter table "public"."boards" add constraint "boards_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."boards" validate constraint "boards_created_by_fkey";

alter table "public"."boards" add constraint "boards_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."boards" validate constraint "boards_organization_id_fkey";

alter table "public"."boards" add constraint "boards_title_check" CHECK (((length(title) >= 2) AND (length(title) <= 100))) not valid;

alter table "public"."boards" validate constraint "boards_title_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_creator_to_board()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO public.board_members(user_id, board_id, role, joined_at, created_at, updated_at)
  VALUES (NEW.created_by, NEW.id, 'admin'::boards_role, now(), now(), now());
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_board_member(board_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.board_members bm
    WHERE bm.board_id = board_id
      AND bm.user_id = (SELECT auth.uid())
  );
$function$
;

grant delete on table "public"."board_members" to "anon";

grant insert on table "public"."board_members" to "anon";

grant references on table "public"."board_members" to "anon";

grant select on table "public"."board_members" to "anon";

grant trigger on table "public"."board_members" to "anon";

grant truncate on table "public"."board_members" to "anon";

grant update on table "public"."board_members" to "anon";

grant delete on table "public"."board_members" to "authenticated";

grant insert on table "public"."board_members" to "authenticated";

grant references on table "public"."board_members" to "authenticated";

grant select on table "public"."board_members" to "authenticated";

grant trigger on table "public"."board_members" to "authenticated";

grant truncate on table "public"."board_members" to "authenticated";

grant update on table "public"."board_members" to "authenticated";

grant delete on table "public"."board_members" to "service_role";

grant insert on table "public"."board_members" to "service_role";

grant references on table "public"."board_members" to "service_role";

grant select on table "public"."board_members" to "service_role";

grant trigger on table "public"."board_members" to "service_role";

grant truncate on table "public"."board_members" to "service_role";

grant update on table "public"."board_members" to "service_role";

grant delete on table "public"."boards" to "anon";

grant insert on table "public"."boards" to "anon";

grant references on table "public"."boards" to "anon";

grant select on table "public"."boards" to "anon";

grant trigger on table "public"."boards" to "anon";

grant truncate on table "public"."boards" to "anon";

grant update on table "public"."boards" to "anon";

grant delete on table "public"."boards" to "authenticated";

grant insert on table "public"."boards" to "authenticated";

grant references on table "public"."boards" to "authenticated";

grant select on table "public"."boards" to "authenticated";

grant trigger on table "public"."boards" to "authenticated";

grant truncate on table "public"."boards" to "authenticated";

grant update on table "public"."boards" to "authenticated";

grant delete on table "public"."boards" to "service_role";

grant insert on table "public"."boards" to "service_role";

grant references on table "public"."boards" to "service_role";

grant select on table "public"."boards" to "service_role";

grant trigger on table "public"."boards" to "service_role";

grant truncate on table "public"."boards" to "service_role";

grant update on table "public"."boards" to "service_role";

create policy "Admins delete board member"
on "public"."board_members"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM board_members bm
  WHERE ((bm.board_id = board_members.board_id) AND (bm.user_id = ( SELECT auth.uid() AS uid)) AND (bm.role = 'admin'::boards_role)))));


create policy "Admins insert board member"
on "public"."board_members"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM board_members bm
  WHERE ((bm.board_id = board_members.board_id) AND (bm.user_id = ( SELECT auth.uid() AS uid)) AND (bm.role = 'admin'::boards_role)))));


create policy "Admins update board member"
on "public"."board_members"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM board_members bm
  WHERE ((bm.board_id = board_members.board_id) AND (bm.user_id = ( SELECT auth.uid() AS uid)) AND (bm.role = 'admin'::boards_role)))))
with check ((EXISTS ( SELECT 1
   FROM board_members bm
  WHERE ((bm.board_id = board_members.board_id) AND (bm.user_id = ( SELECT auth.uid() AS uid)) AND (bm.role = 'admin'::boards_role)))));


create policy "Members view board members"
on "public"."board_members"
as permissive
for select
to authenticated
using (is_board_member(board_id));


create policy "Admin delete board"
on "public"."boards"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM board_members bm
  WHERE ((bm.board_id = boards.id) AND (bm.user_id = ( SELECT auth.uid() AS uid)) AND (bm.role = 'admin'::boards_role)))));


create policy "Admin update board"
on "public"."boards"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM board_members bm
  WHERE ((bm.board_id = boards.id) AND (bm.user_id = ( SELECT auth.uid() AS uid)) AND (bm.role = 'admin'::boards_role)))))
with check ((EXISTS ( SELECT 1
   FROM board_members bm
  WHERE ((bm.board_id = boards.id) AND (bm.user_id = ( SELECT auth.uid() AS uid)) AND (bm.role = 'admin'::boards_role)))));


create policy "Member view boards"
on "public"."boards"
as permissive
for select
to authenticated
using (((visibility = 'public'::boards_visibility) OR is_board_member(id)));


CREATE TRIGGER handle_updated_at_board_members BEFORE UPDATE ON public.board_members FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at_boards BEFORE UPDATE ON public.boards FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER trg_add_creator_to_board AFTER INSERT ON public.boards FOR EACH ROW EXECUTE FUNCTION add_creator_to_board();


