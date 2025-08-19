create table if not exists profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ not null default NOW(),
    updated_at TIMESTAMPTZ not null default NOW()
);

alter table profiles enable row level security;

create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Users can delete their own profile" on profiles for delete using (auth.uid() = id);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);


create trigger
  handle_updated_at before update
on profiles
for each row execute
  procedure moddatetime(updated_at);
