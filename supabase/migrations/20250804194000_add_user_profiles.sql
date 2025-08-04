alter table "public"."profiles" alter column "created_at" set default now();

alter table "public"."profiles" alter column "updated_at" set default now();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


