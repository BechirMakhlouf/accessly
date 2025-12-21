import { Provider } from '@supabase/supabase-js';
import type { TypedSupabaseClient } from '@/lib/supabase/type';
import { getFullRoute, routes } from '@/lib/routes';
import { translateErrorCode } from 'supabase-error-translator-js';
import type { Locale } from '@/lib/i18n';

export const signInWithOauth = async (
  supabase: TypedSupabaseClient,
  messageLocale: Locale,
  provider: Provider
) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getFullRoute(routes.api.auth.callback),
    },
  });

  if (error)
    error.message = translateErrorCode(error.code, 'auth', messageLocale);

  return { data, error };
};
