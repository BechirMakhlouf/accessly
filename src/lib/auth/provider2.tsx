"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SupabaseCSRClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type SignUpCredentials = {
  email?: string;
  phone?: string;
  password?: string;
  options?: any;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithPassword: (creds: { email: string; password: string }) => Promise<any>;
  signUp: (creds: SignUpCredentials) => Promise<any>;
  signOut: () => Promise<any>;
  signInWithOAuth: (provider: string, options?: { redirectTo?: string; scopes?: string }) => Promise<any>;
  signInWithOtp: (payload: { email?: string; phone?: string; options?: any }) => Promise<any>;
  resetPasswordForEmail: (email: string, redirectTo?: string) => Promise<any>;
  updateUser: (attributes: { password?: string; data?: any }) => Promise<any>;
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
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setSession(data?.session ?? null);
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession ?? null);

      try {
        if (event === "SIGNED_OUT") {
          // explicitly set typed cache to null
          queryClient.setQueryData<User | null>(AUTH_USER_QUERY_KEY, null);
        } else {
          const { data } = await supabase.auth.getUser();
          queryClient.setQueryData<User | null>(AUTH_USER_QUERY_KEY, data?.user ?? null);
        }
      } catch {
        queryClient.setQueryData<User | null>(AUTH_USER_QUERY_KEY, null);
      }
    });

    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };

  }, [queryClient, supabase]);

  async function signInWithPassword(creds: { email: string; password: string }) {
    const res = await supabase.auth.signInWithPassword(creds);
    // invalidate using filter object (safe typing)
    queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
    const s = await supabase.auth.getSession();
    setSession(s.data?.session ?? null);
    return res;
  }

  async function signUp(creds: SignUpCredentials) {
    const res = await supabase.auth.signUp(creds as any);
    queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
    return res;
  }

  async function signOut() {
    const res = await supabase.auth.signOut();
    queryClient.setQueryData<User | null>(AUTH_USER_QUERY_KEY, null);
    setSession(null);
    // optionally refresh other queries
    await queryClient.invalidateQueries();
    return res;
  }

  async function signInWithOAuth(provider: string, options?: { redirectTo?: string; scopes?: string }) {
    const res = await supabase.auth.signInWithOAuth({
      provider,
      options,
    } as any);
    return res;
  }

  async function signInWithOtp(payload: { email?: string; phone?: string; options?: any }) {
    const res = await supabase.auth.signInWithOtp(payload as any);
    return res;
  }

  async function resetPasswordForEmail(email: string, redirectTo?: string) {
    const res = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return res;
  }

  async function updateUser(attributes: { password?: string; data?: any }) {
    const res = await supabase.auth.updateUser(attributes as any);
    queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
    return res;
  }

  async function refetchUser() {
    await refetch();
  }

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
      updateUser,
      refetchUser,
    }),
    [user, session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContextValue() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContextValue must be used within AuthProvider");
  return ctx;
}
