create type "public"."accessable_type" as enum ('saas_app', 'infrastructure', 'database', 'shared_credentials', 'file_storage', 'vpn', 'physical', 'custom');

create table "public"."accessables" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "board_id" uuid not null,
    "user_id" uuid not null,
    "name" text not null,
    "type" accessable_type not null,
    "description" text,
    "owner_user_id" uuid,
    "url" text,
    "metadata" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."accessables" enable row level security;

CREATE UNIQUE INDEX accessables_pkey ON public.accessables USING btree (id);

alter table "public"."accessables" add constraint "accessables_pkey" PRIMARY KEY using index "accessables_pkey";

alter table "public"."accessables" add constraint "accessables_board_id_fkey" FOREIGN KEY (board_id) REFERENCES boards(id) not valid;

alter table "public"."accessables" validate constraint "accessables_board_id_fkey";

alter table "public"."accessables" add constraint "accessables_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."accessables" validate constraint "accessables_organization_id_fkey";

alter table "public"."accessables" add constraint "accessables_owner_user_id_fkey" FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."accessables" validate constraint "accessables_owner_user_id_fkey";

alter table "public"."accessables" add constraint "accessables_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."accessables" validate constraint "accessables_user_id_fkey";

grant delete on table "public"."accessables" to "anon";

grant insert on table "public"."accessables" to "anon";

grant references on table "public"."accessables" to "anon";

grant select on table "public"."accessables" to "anon";

grant trigger on table "public"."accessables" to "anon";

grant truncate on table "public"."accessables" to "anon";

grant update on table "public"."accessables" to "anon";

grant delete on table "public"."accessables" to "authenticated";

grant insert on table "public"."accessables" to "authenticated";

grant references on table "public"."accessables" to "authenticated";

grant select on table "public"."accessables" to "authenticated";

grant trigger on table "public"."accessables" to "authenticated";

grant truncate on table "public"."accessables" to "authenticated";

grant update on table "public"."accessables" to "authenticated";

grant delete on table "public"."accessables" to "service_role";

grant insert on table "public"."accessables" to "service_role";

grant references on table "public"."accessables" to "service_role";

grant select on table "public"."accessables" to "service_role";

grant trigger on table "public"."accessables" to "service_role";

grant truncate on table "public"."accessables" to "service_role";

grant update on table "public"."accessables" to "service_role";

CREATE TRIGGER handle_update_at_accessables BEFORE UPDATE ON public.accessables FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


