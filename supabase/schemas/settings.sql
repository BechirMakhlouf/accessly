-- Create user_settings table with improved constraints and indexing
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text CHECK (theme IN ('light', 'dark', 'system')) NOT NULL DEFAULT 'system',
  language text NOT NULL DEFAULT 'en' CHECK (length(language) = 2),
  notifications_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create an index on the id column for faster lookups
CREATE INDEX idx_user_settings_id ON user_settings(id);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Comprehensive RLS Policies
-- SELECT Policy
CREATE POLICY "Users can view their own settings" 
ON user_settings 
FOR SELECT 
TO authenticated 
USING ((SELECT auth.uid()) = id);

-- INSERT Policy
CREATE POLICY "Users can create their own settings" 
ON user_settings 
FOR INSERT 
TO authenticated 
WITH CHECK (
  (SELECT auth.uid()) = id AND 
  id IS NOT NULL
);

-- UPDATE Policy
CREATE POLICY "Users can update their own settings" 
ON user_settings 
FOR UPDATE 
TO authenticated 
USING ((SELECT auth.uid()) = id)
WITH CHECK (
  (SELECT auth.uid()) = id AND 
  id IS NULL AND  -- Prevent changing id
  created_at IS NULL  -- Prevent changing created_at
);

-- DELETE Policy
CREATE POLICY "Users can delete their own settings" 
ON user_settings 
FOR DELETE 
TO authenticated 
USING ((SELECT auth.uid()) = id);

CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON user_settings
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
