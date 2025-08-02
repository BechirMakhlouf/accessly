import { TypedSupabaseClient } from "./type";


export async function getUserId(supabase: TypedSupabaseClient) {
  return (await supabase.auth.getClaims()).data?.claims.sub
}
