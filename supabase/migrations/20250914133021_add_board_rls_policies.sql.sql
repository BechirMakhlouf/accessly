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



