-- Create avatars bucket (this can be done via Supabase Dashboard or SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Policy to allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own avatars" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Policy to allow users to view their own avatars
CREATE POLICY "Users can view own avatars" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Policy to allow users to update their own avatars
CREATE POLICY "Users can update own avatars" ON storage.objects
FOR UPDATE TO authenticated
USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = (SELECT auth.uid()::text)
)
WITH CHECK (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Policy to allow users to delete their own avatars
CREATE POLICY "Users can delete own avatars" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);
