create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text, 
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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