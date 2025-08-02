-- Use Postgres to create a bucket.
insert into storage.buckets
  (id, name, public)
values
  ('avatars', 'avatars', true);

-- CREATE Avatar File (insert)
CREATE POLICY "Can upload own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- UPDATE Avatar File
CREATE POLICY "Can update own avatar"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- DELETE Avatar File
CREATE POLICY "Can delete own avatar"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- (Optionally) SELECT Avatar File
CREATE POLICY "Can read avatar"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);
