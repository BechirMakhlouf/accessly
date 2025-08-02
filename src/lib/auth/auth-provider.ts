'use client'

import { useEffect } from "react";
import { SupabaseCSRClient } from "@/lib/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { AUTH_USER_KEY, getAuthUserQueryOptions } from "./queries";
import { getQueryClient } from "../query-client";

export function AuthProvider() {
  const queryClient = getQueryClient();

  // Hydrate the user on first render
  useQuery(getAuthUserQueryOptions(SupabaseCSRClient));

  useEffect(() => {
    // Invalidate cached user on every auth state change (forces refetch)
    const { data: { subscription } } = SupabaseCSRClient.auth.onAuthStateChange(
      () => {
        queryClient.invalidateQueries({ queryKey: AUTH_USER_KEY });
      }
    );
    return () => subscription.unsubscribe();
  }, [queryClient]);

  return null;
}
