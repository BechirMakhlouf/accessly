"use client";
import { useAuthContextValue } from "../provider2";

export function useAuth() {
  return useAuthContextValue();
}
