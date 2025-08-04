alter table "public"."invites" alter column "id" set default gen_random_uuid();

alter table "public"."teams" alter column "id" set default gen_random_uuid();


