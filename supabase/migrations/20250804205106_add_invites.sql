create table "public"."invites" (
    "id" uuid not null,
    "team_id" uuid not null,
    "invited_by" uuid not null,
    "invite_link" text not null,
    "email" text not null,
    "created_at" timestamp with time zone not null default now(),
    "expires_at" timestamp with time zone not null,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."invites" enable row level security;

CREATE UNIQUE INDEX invites_pkey ON public.invites USING btree (id);

alter table "public"."invites" add constraint "invites_pkey" PRIMARY KEY using index "invites_pkey";

alter table "public"."invites" add constraint "invites_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES auth.users(id) not valid;

alter table "public"."invites" validate constraint "invites_invited_by_fkey";

grant delete on table "public"."invites" to "anon";

grant insert on table "public"."invites" to "anon";

grant references on table "public"."invites" to "anon";

grant select on table "public"."invites" to "anon";

grant trigger on table "public"."invites" to "anon";

grant truncate on table "public"."invites" to "anon";

grant update on table "public"."invites" to "anon";

grant delete on table "public"."invites" to "authenticated";

grant insert on table "public"."invites" to "authenticated";

grant references on table "public"."invites" to "authenticated";

grant select on table "public"."invites" to "authenticated";

grant trigger on table "public"."invites" to "authenticated";

grant truncate on table "public"."invites" to "authenticated";

grant update on table "public"."invites" to "authenticated";

grant delete on table "public"."invites" to "service_role";

grant insert on table "public"."invites" to "service_role";

grant references on table "public"."invites" to "service_role";

grant select on table "public"."invites" to "service_role";

grant trigger on table "public"."invites" to "service_role";

grant truncate on table "public"."invites" to "service_role";

grant update on table "public"."invites" to "service_role";

create policy "Users can update invites they sent"
on "public"."invites"
as permissive
for update
to public
using ((auth.uid() = invited_by));


create policy "Users can view invites they sent"
on "public"."invites"
as permissive
for select
to public
using ((auth.uid() = invited_by));


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.invites FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


