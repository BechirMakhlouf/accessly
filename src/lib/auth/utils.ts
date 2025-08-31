import { SupabaseClient } from "@supabase/supabase-js"


export async function getUserId(supabase: SupabaseClient) {
  // Prefer JWT claims (fast) then fall back to getUser(). Always return null on failure.
  try {
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
    if (!claimsError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub = (claimsData as any)?.claims?.sub;
      if (sub) return sub;
    }
  } catch (e) {
    console.debug('error while getting user claims: ', e);
  }

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.debug('error while getting user: ', error);
    } else if (data) {
      return data.user.id;
    }
  } catch (e) {
    console.error('error while calling getUser():', e);
  }

  return null;
}
