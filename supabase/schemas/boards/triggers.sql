-- 1. Trigger to update updated_at on boards
CREATE TRIGGER handle_updated_at_boards
BEFORE UPDATE ON boards
FOR EACH ROW
EXECUTE FUNCTION moddatetime(updated_at);

-- 2. Trigger to update updated_at on board_members
CREATE TRIGGER handle_updated_at_board_members
BEFORE UPDATE ON board_members
FOR EACH ROW
EXECUTE FUNCTION moddatetime(updated_at);

-- 3. Trigger to automatically add creator as admin to board
-- (Assumes you have a helper function: add_creator_to_board())
CREATE TRIGGER trg_add_creator_to_board
AFTER INSERT ON boards
FOR EACH ROW
EXECUTE FUNCTION public.add_creator_to_board();

REVOKE EXECUTE ON FUNCTION public.add_creator_to_board() FROM anon, authenticated;
