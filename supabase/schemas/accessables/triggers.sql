create trigger handle_update_at_accessables
before update on public.accessables
for each row
execute function moddatetime(updated_at);
