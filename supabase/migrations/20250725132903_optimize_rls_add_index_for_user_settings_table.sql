drop policy "Users can delete their settings" on "public"."user_settings";

drop policy "Users can insert their own settings" on "public"."user_settings";

drop policy "Users can select their settings" on "public"."user_settings";

drop policy "Users can update their settings" on "public"."user_settings";

CREATE INDEX userid ON public.user_settings USING btree (user_id);

create policy "Users can delete their settings"
on "public"."user_settings"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can insert their own settings"
on "public"."user_settings"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can select their settings"
on "public"."user_settings"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update their settings"
on "public"."user_settings"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



