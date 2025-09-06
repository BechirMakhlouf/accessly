"use client";

import { SupabaseCSRClient } from "@/lib/supabase/client";
import type {
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  AuthTokenResponsePassword,
  OAuthResponse,
  Provider,
  Session,
  SignInWithPasswordlessCredentials,
  SignUpWithPasswordCredentials,
  User,
} from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { signOut as signOutAction } from "./actions";
import { getFullRoute, routes } from "../routes";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithPassword: (
    creds: { email: string; password: string },
  ) => Promise<AuthTokenResponsePassword>;
  signUp: (creds: SignUpWithPasswordCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  signInWithOAuth: (
    provider: Provider,
    options?: { redirectTo?: string; scopes?: string },
  ) => Promise<OAuthResponse>;
  signInWithOtp: (
    creds: SignInWithPasswordlessCredentials,
  ) => Promise<AuthOtpResponse>;
  resetPasswordForEmail: (email: string, redirectTo?: string) => Promise<
    {
      data: object;
      error: null;
    } | {
      data: null;
      error: AuthError;
    }
  >;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_USER_QUERY_KEY = ["auth", "user"] as const;

export function AuthProvider({ children }: React.PropsWithChildren) {
  const supabase = SupabaseCSRClient;
  const queryClient = useQueryClient();

  const [session, setSession] = useState<Session | null>(null);

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User | null, Error, User | null, readonly string[]>({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data?.user ?? null;
    },
  });

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession ?? null);

        try {
          if (event === "SIGNED_OUT") {
            queryClient.setQueryData<User | null>(AUTH_USER_QUERY_KEY, null);
          } else {
            // const { data } = await supabase.auth.getUser();
            // queryClient.setQueryData<User | null>(AUTH_USER_QUERY_KEY, data?.user ?? null);
          }
        } catch {
          queryClient.setQueryData<User | null>(AUTH_USER_QUERY_KEY, null);
        }
      },
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [queryClient, supabase]);

  const signInWithPassword = useCallback(
    async (creds: { email: string; password: string }) => {
      const res = await supabase.auth.signInWithPassword(creds);
      queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
      const s = await supabase.auth.getSession();
      setSession(s.data?.session ?? null);
      return res;
    },
    [supabase.auth, queryClient],
  );

  const signUp = useCallback(
    async (creds: SignUpWithPasswordCredentials) => {
      const res = await supabase.auth.signUp(creds);
      queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
      return res;
    },
    [queryClient, supabase.auth],
  );

  const signOut = useCallback(async () => {
    await signOutAction();
  }, []);

  const signInWithOAuth = useCallback(
    async (
      provider: Provider,
      options?: { redirectTo?: string; scopes?: string },
    ) => {
      console.info(
        "oauth redirecting to: ",
        getFullRoute(routes.api.auth.callback),
      );
      return await supabase.auth.signInWithOAuth({
        provider,
        options: {
          ...options,
          redirectTo: getFullRoute(routes.api.auth.callback),
        },
      });
    },
    [supabase.auth],
  );

  const signInWithOtp = useCallback(
    async (creds: SignInWithPasswordlessCredentials) => {
      return await supabase.auth.signInWithOtp(creds);
    },
    [supabase.auth],
  );

  const resetPasswordForEmail = useCallback(
    async (email: string, redirectTo?: string) => {
      return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    },
    [supabase.auth],
  );

  const refetchUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      session: session ?? null,
      isLoading,
      signInWithPassword,
      signUp,
      signOut,
      signInWithOAuth,
      signInWithOtp,
      resetPasswordForEmail,
      refetchUser,
    }),
    [
      user,
      session,
      isLoading,
      signInWithPassword,
      signUp,
      signOut,
      signInWithOAuth,
      signInWithOtp,
      resetPasswordForEmail,
      refetchUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContextValue() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContextValue must be used within AuthProvider");
  }
  return ctx;
}
