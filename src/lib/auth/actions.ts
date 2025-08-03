"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSSRClient } from "@/lib/supabase/server"
// import { getFullRoute } from "@/lib/routes"
import { routes } from "@/lib/routes"
// import { Provider } from "@supabase/supabase-js"

// export async function signUp(formData: {
//   firstName: string
//   lastName: string
//   email: string
//   password: string
// }) {
//   const supabase = await createSSRClient()
//
//   const { error } = await supabase.auth.signUp({
//     email: formData.email,
//     password: formData.password,
//     options: {
//       data: {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         full_name: `${formData.firstName} ${formData.lastName}`,
//       },
//     },
//   })
//
//   if (error) {
//     return { error: error.message }
//   }
//
//   revalidatePath("/", "layout");
//   redirect(routes.auth.confirmEmail);
// }

// export async function signIn(formData: {
//   email: string
//   password: string
// }) {
//   const supabase = await createSSRClient()
//
//   const { error } = await supabase.auth.signInWithPassword({
//     email: formData.email,
//     password: formData.password,
//   })
//
//   if (error) {
//     console.log("hello ladies: ", error.code);
//     return { error: error.message }
//   }
//
//   revalidatePath("/", "layout")
//   redirect("/")
// }

// export async function resetPassword(formData: {
//   email: string
// }) {
//   const supabase = await createSSRClient()
//
//   const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
//     redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
//   })
//
//   if (error) {
//     return { error: error.message }
//   }
//
//   return { success: true }
// }

export async function signOut() {
  const supabase = await createSSRClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect(routes.auth.signIn)
}

// export async function signInWithOAuth(provider: Provider) {
//   const supabase = await createSSRClient()
//
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider,
//     options: {
//       redirectTo: getFullRoute("/api/auth/callback"),
//     },
//   })
//
//   if (error) {
//     return { data, error };
//   }
//
//   redirect(data.url)
// }

// export async function getCurrentUser() {
//   const supabase = await createSSRClient()
//   const { data: { user } } = await supabase.auth.getUser();
//
//   return user
// }


export async function isAuthenticated() {
  const supabase = await createSSRClient()
  const { data } = await supabase.auth.getClaims();
  return data != null;
}

// export async function resendEmail(type: 'signup' | 'email_change', email: string) {
//   const supabase = await createSSRClient()
//
//   return await supabase.auth.resend({
//     type, email
//   });
//
// }
