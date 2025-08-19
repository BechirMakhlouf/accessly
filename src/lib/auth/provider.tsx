'use client'
import { ReactNode, useEffect } from "react";
import { SupabaseCSRClient } from "../supabase/client";
import { AUTH_USER_KEY } from "./queries";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function AuthProvider({ children }: { children?: ReactNode }) {
  const queryClient = useQueryClient();
  const supabase = SupabaseCSRClient;
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        console.debug("[auth] ", event);
        await queryClient.invalidateQueries({ queryKey: AUTH_USER_KEY });
        if (event === "SIGNED_OUT") {
          // client navigation
          router.push("/auth/signin");
        }
      }
    );

    return () => subscription?.unsubscribe();

  }, [supabase, queryClient, router]);

  return <>{children}</>;
}
