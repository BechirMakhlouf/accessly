import { Provider } from "@supabase/supabase-js";
import { TypedSupabaseClient } from "@/lib/supabase/type";
import { getFullRoute, routes } from "@/lib/routes";
import { Locale } from "@/lib/i18n";


export const signInWithOauth = async (supabase: TypedSupabaseClient, messageLocale: Locale, provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: getFullRoute(routes.api.auth.callback),
        },
    });

    // Pass through raw error; UI will localize/auth-specific map

    return { data, error };
};