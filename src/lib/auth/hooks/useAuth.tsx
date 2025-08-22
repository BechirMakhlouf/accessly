"use client";
import { useAuthContextValue } from "../provider";

export function useAuth() {
  return useAuthContextValue();
}
