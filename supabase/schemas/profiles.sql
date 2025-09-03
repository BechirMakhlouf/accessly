-- Create user_profiles table with enhanced constraints
CREATE TABLE public.user_profiles (
    id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    email text NOT NULL UNIQUE DEFAULT auth.email(),
    avatar_url text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger for automatic updated_at (assumes moddatetime function exists)
CREATE TRIGGER update_user_profiles_modtime
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

-- RLS Policies
-- SELECT: Allow anyone to view profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles
FOR SELECT TO anon, authenticated
USING (true);

-- INSERT: Enforce that users can only create their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT TO authenticated
WITH CHECK (
    (SELECT auth.uid()) = id 
    AND id IS NOT NULL
);

-- UPDATE: Allow users to update their own profile with restrictions
CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK (
    (SELECT auth.uid()) = id 
    AND id IS NULL  -- Prevent changing id
    AND created_at IS NULL  -- Prevent changing created_at
);

-- DELETE: Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON public.user_profiles
FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = id);
