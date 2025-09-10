alter table "public"."invites" drop constraint "invites_email_check";

alter table "public"."invites" drop constraint "invites_invite_token_key";

drop index if exists "public"."invites_invite_token_key";

alter table "public"."invites" drop column "invite_token";