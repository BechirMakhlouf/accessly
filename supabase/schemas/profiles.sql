-- Create user_profiles table with enhanced constraints
CREATE TABLE public.user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
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
-- SELECT: Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
FOR SELECT TO authenticated
USING ((select auth.uid()) = id);

-- INSERT: Enforce that users can only create their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT TO authenticated
WITH CHECK ((select auth.uid()) = id);

-- UPDATE: Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE TO authenticated
USING ((select auth.uid()) = id)
WITH CHECK ((select auth.uid()) = id);

-- DELETE: Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON public.user_profiles
FOR DELETE TO authenticated
USING ((select auth.uid()) = id);
