drop trigger if exists "handle_updated_at" on "public"."invites";

drop trigger if exists "handle_updated_at" on "public"."team_members";

drop trigger if exists "handle_updated_at" on "public"."teams";

alter table "public"."invites" add constraint "invites_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."invites" validate constraint "invites_team_id_fkey";

create policy "Admins can delete team membership"
on "public"."team_members"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM team_members tm
  WHERE ((tm.user_id = auth.uid()) AND (tm.team_id = team_members.team_id) AND (tm.role = 'admin'::team_role)))));


create policy "Admins can update team membership"
on "public"."team_members"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM team_members tm
  WHERE ((tm.user_id = auth.uid()) AND (tm.team_id = team_members.team_id) AND (tm.role = 'admin'::team_role)))));


create policy "Team members can view membership"
on "public"."team_members"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM team_members tm
  WHERE ((tm.user_id = auth.uid()) AND (tm.team_id = team_members.team_id)))));


CREATE TRIGGER handle_updated_at_invites BEFORE UPDATE ON public.invites FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at_members BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at_teams BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


