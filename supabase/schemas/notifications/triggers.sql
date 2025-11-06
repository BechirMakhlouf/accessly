CREATE TRIGGER handle_updated_at_notifications
BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);