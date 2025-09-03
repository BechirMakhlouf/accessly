import { revalidatePath } from "next/cache";
import { createSSRClient } from "../supabase/server";
import { getUserId } from "./utils";
import { redirect } from "next/navigation";
import { routes } from "../routes";

//INFO: use this when you want a userId and to prohibit access when unauthenticated.
export async function assertSignedInAndGetUserId() {
  const supabase = await createSSRClient();
  const userId = await getUserId(supabase)

  if (!userId) {
    console.info("redirecting to sign in");
    revalidatePath("/", "layout")
    redirect(routes.auth.signIn)
  }

  return userId;
}
