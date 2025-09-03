CREATE OR REPLACE FUNCTION public.handle_update_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update user profile email to keep it in sync with auth.users
  UPDATE public.user_profiles 
  SET 
    email = NEW.email,
    updated_at = now()
  WHERE id = NEW.id;

  -- Update user settings updated_at timestamp
  UPDATE public.user_settings 
  SET updated_at = now()
  WHERE id = NEW.id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error updating user records: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger
CREATE OR REPLACE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_update_user();
