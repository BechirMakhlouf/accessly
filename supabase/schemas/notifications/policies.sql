ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT only their own notifications
CREATE POLICY "Users can read their notifications"
ON notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can mark notifications as read"
ON notifications
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
