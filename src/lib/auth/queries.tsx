import type { Provider } from "@supabase/supabase-js";
import { TypedSupabaseClient } from "@/lib/supabase/type";
import { translateErrorCode } from 'supabase-error-translator-js';
import { QueryClient } from "@tanstack/react-query";
import { Locale } from "../i18n/config";
import { getFullRoute, routes } from "../routes";
import { signInWithOAuthAction } from "./actions";

export const AUTH_USER_KEY = ["auth", "user"] as const;

export async function signInWithPassword(
  supabase: TypedSupabaseClient,
  { email, password }: { email: string; password: string },
  messageLocale: Locale
) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    error.message = translateErrorCode(error.code, "auth", messageLocale);
    throw error;
  }
  return data.user;
}

export async function signUp(
  supabase: TypedSupabaseClient,
  { email, password }: { email: string; password: string },
  messageLocale: Locale
) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    error.message = translateErrorCode(error.code, "auth", messageLocale);
    throw error;
  }
  return data.user ?? null;
}

export async function signOut(
  supabase: TypedSupabaseClient,
  messageLocale: Locale
) {
  const { error } = await supabase.auth.signOut();
  if (error) {
    error.message = translateErrorCode(error.code, "auth", messageLocale);
    throw error;
  }
  return null;
}

export async function signInWithOAuth(
  supabase: TypedSupabaseClient,
  provider: Provider,
  messageLocale: Locale
) {

  if (supabase === null) return null

  const redirectTo = getFullRoute(routes.api.auth.callback)
  console.log("[auth] signing with oauth with redirectTo: ", redirectTo);
  // const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
  const { data, error } = await signInWithOAuthAction(provider)

  if (error) {
    error.message = translateErrorCode(error.code, "auth", messageLocale);
    throw error;
  }
  return data;
}

// Optional: a query for current user (if using SSR, hydrate from token/session/etc)
export async function getAuthUser(supabase: TypedSupabaseClient) {
  return await supabase.auth.getUser(); // Your CSR/SSR get user function
}


// ---- React Query options "builders" ----

export const getAuthUserQueryOptions = (supabase: TypedSupabaseClient) => ({
  queryKey: AUTH_USER_KEY,
  queryFn: () => getAuthUser(supabase),
});


export const signInMutationOptions = (
  supabase: TypedSupabaseClient,
  queryClient: QueryClient,
  messageLocale: Locale
) => ({
  mutationFn: (vars: { email: string; password: string }) =>
    signInWithPassword(supabase, vars, messageLocale),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: AUTH_USER_KEY });
  }
});

export const signOutMutationOptions = (
  supabase: TypedSupabaseClient,
  queryClient: QueryClient,
  messageLocale: Locale
) => ({
  mutationFn: () => signOut(supabase, messageLocale),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: AUTH_USER_KEY });
  }
});

export const signUpMutationOptions = (
  supabase: TypedSupabaseClient,
  queryClient: QueryClient,
  messageLocale: Locale
) => ({
  mutationFn: (vars: { email: string; password: string }) =>
    signUp(supabase, vars, messageLocale),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: AUTH_USER_KEY });
  }
});

export const signInWithOAuthMutationOptions = (
  supabase: TypedSupabaseClient,
  queryClient: QueryClient,
  messageLocale: Locale
) => ({
  mutationFn: (provider: Provider) =>
    signInWithOAuth(supabase, provider, messageLocale),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: AUTH_USER_KEY });
  }
});
