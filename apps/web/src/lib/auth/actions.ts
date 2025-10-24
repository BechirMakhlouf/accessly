"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/server";
import { getFullRoute, routes } from "@/lib/routes";
import { getUserId } from "./utils";
import { Provider } from "@supabase/supabase-js";

export async function signOut() {
  const supabase = await createSSRClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(routes.auth.signIn);
}

export async function signInWithOAuthAction(provider: Provider) {
  const supabase = await createSSRClient();

  const redirectTo = getFullRoute(routes.api.auth.callback);
  console.log("[auth][oauth] signing with oauth with redirectTo: ", redirectTo);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error("[auth][oauth] error while signing in: ", error);
    return { data, error };
  }

  revalidatePath("/", "layout");
  console.log("[auth][oauth] redirecting to: ", data.url);
  redirect(data.url);
}

export async function isAuthenticated() {
  const supabase = await createSSRClient();
  return (await getUserId(supabase)) !== null;
}

export async function updateUserEmail(email: string) {
  const supabase = await createSSRClient();
  return await supabase.auth.updateUser({ email });
}

export async function updateUserPhone(phone: string) {
  const supabase = await createSSRClient();
  return await supabase.auth.updateUser({ phone });
}

export async function getUserPhone() {
  const supabase = await createSSRClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return { data: null, error };
  return { data: data?.user?.phone ?? null };
}

export async function getUserEmail() {
  const supabase = await createSSRClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return { data: null, error };
  return { data: data?.user?.email ?? null };
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = await createSSRClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getFullRoute(routes.api.auth.confirmEmail, {
        next: routes.protected.dashboard.root,
      }),
    },
  });

  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createSSRClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signInWithMagicLink(email: string) {
  const supabase = await createSSRClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getFullRoute(routes.api.auth.confirmEmail, {
        next: routes.protected.dashboard.root,
      }),
    },
  });

  return { data, error };
}

export async function resetPassword(email: string) {
  const supabase = await createSSRClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getFullRoute(routes.api.auth.resetPassword),
  });

  return { data, error };
}

export async function verifyOtp(
  email: string,
  token: string,
  type: "email" | "recovery" | "magiclink" | "email_change",
) {
  const supabase = await createSSRClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type,
  });

  return { data, error };
}
