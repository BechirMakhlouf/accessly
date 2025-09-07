import { Provider } from "@supabase/supabase-js";
import { TypedSupabaseClient } from "@/lib/supabase/type";
import { getFullRoute, routes } from "@/lib/routes";
import { translateErrorCode } from "supabase-error-translator-js";
import { Locale } from "@/lib/i18n";


export const signInWithOauth = async (supabase: TypedSupabaseClient, messageLocale: Locale, provider: Provider) => {
    console.error("[auth][oauth] signing with oauth with redirectTo: ", getFullRoute(routes.api.auth.callback));
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: getFullRoute(routes.api.auth.callback),
        },
    });

    if (error) 
        error.message = translateErrorCode(error.code, "auth", messageLocale);
    

    return { data, error };
};