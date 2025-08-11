create table if not exists user_settings (
  id uuid primary key references auth.users(id) on delete cascade,
  avatar_url text,
  theme text check (theme in ('light', 'dark', 'system')) default 'system',
  language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their settings"
  ON user_settings
  TO authenticated
  using ( (select auth.uid()) = id );

CREATE POLICY "Users can update their settings"
  ON user_settings
  TO authenticated
  using ( (select auth.uid()) = id );

CREATE POLICY "Users can delete their settings"
  ON user_settings
  TO authenticated
  using ( (select auth.uid()) = id );

CREATE POLICY "Users can insert their own settings"
  ON user_settings
  TO authenticated
  using ( (select auth.uid()) = id );

create trigger
  handle_updated_at before update
on user_settings
for each row execute
  procedure moddatetime(updated_at);
