import { env } from '@/lib/env';
import type { Database } from '@/types/database.types';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { TypedSupabaseClient } from './type';

export async function createSSRClient(showDebug: boolean = false) {
  const cookieStore = await cookies();

  const supabase: TypedSupabaseClient = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          const cookies = cookieStore.getAll();
          if (showDebug) {
            console.debug('[Supabase] SSR cookies: ', cookies);
          }

          return cookies;
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
  return supabase;
}
