create type "public"."team_role" as enum ('admin', 'member');

create table "public"."team_members" (
    "user_id" uuid not null,
    "team_id" uuid not null,
    "role" team_role not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."team_members" enable row level security;

create table "public"."teams" (
    "id" uuid not null,
    "name" text not null,
    "description" text not null,
    "icon_url" text,
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."teams" enable row level security;

CREATE UNIQUE INDEX team_members_pkey ON public.team_members USING btree (user_id, team_id);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

alter table "public"."team_members" add constraint "team_members_pkey" PRIMARY KEY using index "team_members_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."team_members" add constraint "team_members_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."team_members" validate constraint "team_members_team_id_fkey";

alter table "public"."team_members" add constraint "team_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."team_members" validate constraint "team_members_user_id_fkey";

grant delete on table "public"."team_members" to "anon";

grant insert on table "public"."team_members" to "anon";

grant references on table "public"."team_members" to "anon";

grant select on table "public"."team_members" to "anon";

grant trigger on table "public"."team_members" to "anon";

grant truncate on table "public"."team_members" to "anon";

grant update on table "public"."team_members" to "anon";

grant delete on table "public"."team_members" to "authenticated";

grant insert on table "public"."team_members" to "authenticated";

grant references on table "public"."team_members" to "authenticated";

grant select on table "public"."team_members" to "authenticated";

grant trigger on table "public"."team_members" to "authenticated";

grant truncate on table "public"."team_members" to "authenticated";

grant update on table "public"."team_members" to "authenticated";

grant delete on table "public"."team_members" to "service_role";

grant insert on table "public"."team_members" to "service_role";

grant references on table "public"."team_members" to "service_role";

grant select on table "public"."team_members" to "service_role";

grant trigger on table "public"."team_members" to "service_role";

grant truncate on table "public"."team_members" to "service_role";

grant update on table "public"."team_members" to "service_role";

grant delete on table "public"."teams" to "anon";

grant insert on table "public"."teams" to "anon";

grant references on table "public"."teams" to "anon";

grant select on table "public"."teams" to "anon";

grant trigger on table "public"."teams" to "anon";

grant truncate on table "public"."teams" to "anon";

grant update on table "public"."teams" to "anon";

grant delete on table "public"."teams" to "authenticated";

grant insert on table "public"."teams" to "authenticated";

grant references on table "public"."teams" to "authenticated";

grant select on table "public"."teams" to "authenticated";

grant trigger on table "public"."teams" to "authenticated";

grant truncate on table "public"."teams" to "authenticated";

grant update on table "public"."teams" to "authenticated";

grant delete on table "public"."teams" to "service_role";

grant insert on table "public"."teams" to "service_role";

grant references on table "public"."teams" to "service_role";

grant select on table "public"."teams" to "service_role";

grant trigger on table "public"."teams" to "service_role";

grant truncate on table "public"."teams" to "service_role";

grant update on table "public"."teams" to "service_role";

create policy "Only team admins can delete team"
on "public"."teams"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.team_id = teams.id) AND (team_members.role = 'admin'::team_role)))));


create policy "Only team admins can update team"
on "public"."teams"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.team_id = teams.id) AND (team_members.role = 'admin'::team_role)))));


create policy "Users can view their own team"
on "public"."teams"
as permissive
for select
to public
using ((auth.uid() = created_by));


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


