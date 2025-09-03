CREATE OR REPLACE FUNCTION public.get_user_by_email(p_email text)
RETURNS auth.users
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
    SELECT * FROM auth.users WHERE email = p_email LIMIT 1;
$$;

-- revoke access to non service role
REVOKE EXECUTE ON FUNCTION public.get_user_by_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_by_email(text) TO service_role;

