set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_by_email(p_email text)
 RETURNS auth.users
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    SELECT * FROM auth.users WHERE email = p_email LIMIT 1;
$function$
;

