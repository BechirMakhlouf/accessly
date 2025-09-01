import { env } from "@/lib/env";
import { Database } from "@/types/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createAdminClient(showDebug: boolean = false) {

  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
    {
      cookies: {
        getAll() {
          const cookies = cookieStore.getAll();
          if (showDebug)
            console.debug("[Supabase] Admin Client cookies: ", cookies);

          return cookies;
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            console.error("[Supabase] Admin Client Error setting cookies: ", cookiesToSet);
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
