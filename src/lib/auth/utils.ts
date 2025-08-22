import { SupabaseClient } from "@supabase/supabase-js"


export async function getUserId(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase.auth.getClaims();

    if (error)
      throw error;

    return data?.claims.sub || null

  } catch (e) {
    console.error("error while gettings user claims: ", e)

    const { data, error } = await supabase.auth.getUser();

    if (error)
      console.error("error while getting user: ", error);

    else if (data) return data.user.id;
  }

  return null;
}
