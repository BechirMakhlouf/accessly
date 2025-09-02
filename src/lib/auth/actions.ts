"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSSRClient } from "@/lib/supabase/server"
import { getFullRoute, routes } from "@/lib/routes"
import { Provider } from "@supabase/supabase-js"
import { getUserId } from "./utils"

export async function signOut() {
  const supabase = await createSSRClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect(routes.auth.signIn)
}

export async function signInWithOAuthAction(provider: Provider) {
  const supabase = await createSSRClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getFullRoute(routes.api.auth.callback),
    },
  })

  if (error) {
    return { data, error };
  }

  redirect(data.url)
}

export async function isAuthenticated() {
  const supabase = await createSSRClient()
  return (await getUserId(supabase)) !== null;
}

export async function updateUserEmail(email: string) {
  const supabase = await createSSRClient();
  return await supabase.auth.updateUser({ email })
}

export async function updateUserPhone(phone: string) {
  const supabase = await createSSRClient();
  return await supabase.auth.updateUser({ phone })
}

export async function getUserPhone() {
  const supabase = await createSSRClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return { data: null, error };
  return { data: data?.user?.phone ?? null }
}

export async function getUserEmail() {
  const supabase = await createSSRClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return { data: null, error };
  return { data: data?.user?.email ?? null }
}
