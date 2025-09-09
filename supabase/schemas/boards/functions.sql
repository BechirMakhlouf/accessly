CREATE OR REPLACE FUNCTION public.add_creator_to_board()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.board_members(user_id, board_id, role, joined_at, created_at, updated_at)
  VALUES (NEW.created_by, NEW.id, 'admin', now(), now(), now());
  RETURN NEW;
END;
$$;
