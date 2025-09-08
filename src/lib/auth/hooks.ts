"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AUTH_USER_KEY,
  getAuthUserQueryOptions,
  signInMutationOptions,
  signUpMutationOptions,
  signInWithOAuthMutationOptions,
} from "./queries";

import { useLocale } from "next-intl";
import { SupabaseCSRClient } from "../supabase/client";
import { signOut } from "./actions";
import { User } from "@supabase/supabase-js";

type SupabaseUser = NonNullable<User>;

export function useAuth() {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const supabase = SupabaseCSRClient;

  // User query
  const {
    data: userRes,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    ...getAuthUserQueryOptions(supabase),
  });

  const user: SupabaseUser | null = userRes?.data?.user ?? null;
  const isAuthenticated = !!user;
  const isGuest = !user && !isLoading;

  // Mutations
  const {
    mutateAsync: signInPassword,
    isPending: isSigningIn,
    error: signInError,
  } = useMutation(signInMutationOptions(supabase, queryClient, locale));

  const {
    mutateAsync: signUp,
    isPending: isSigningUp,
    error: signUpError,
  } = useMutation(signUpMutationOptions(supabase, queryClient, locale));


  const {
    mutateAsync: signInWithOAuth,
    isPending: isSigningInWithOAuth,
    error: signInOAuthError,
  } = useMutation(signInWithOAuthMutationOptions(supabase, queryClient, locale));


  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: AUTH_USER_KEY });

  // Single surfaced error (already localized in your mutation options)
  const anyError = useMemo(
    () => error ?? signInError ?? signUpError ?? signInOAuthError ?? null,
    [error, signInError, signUpError, signInOAuthError]
  );

  return {
    // data
    user,

    // status
    isAuthenticated,
    isGuest,
    isLoading: isLoading || isFetching,
    error: anyError,

    // actions
    signIn: signInPassword,      // (vars: { email, password }) => Promise<User>
    signUp,                      // (vars: { email, password }) => Promise<User | null>
    signOut,                     // () => Promise<null>
    signInWithOAuth,             // (provider: Provider) => Promise<any>
    refresh,                     // invalidate user query

    // pending flags
    isSigningIn,
    isSigningUp,
    isSigningInWithOAuth,

  };
}
