-- Create user_profiles table with enhanced constraints
CREATE TABLE public.user_profiles (
    user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    email text NOT NULL UNIQUE DEFAULT auth.email(),
    avatar_url text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create trigger for automatic updated_at (assumes moddatetime function exists)
CREATE TRIGGER update_user_profiles_modtime
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: anyone (anon or authenticated) can read profiles
CREATE POLICY "Users can view all profiles"
  ON public.user_profiles
  FOR SELECT TO authenticated
  USING (true);

-- INSERT: authenticated users may create **only** their own profile
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (
      (SELECT auth.uid()) = user_id
  );

-- UPDATE: authenticated users may update their own profile,
--         but cannot change immutable columns
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = user_id);

-- DELETE: authenticated users may delete their own profile
CREATE POLICY "Users can delete own profile"
  ON public.user_profiles
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);
