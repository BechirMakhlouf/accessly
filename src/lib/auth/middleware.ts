import { type NextRequest, NextResponse } from "next/server";
import { createSSRClient } from "../supabase/server";
import { routes } from "../routes";
import { getUserId } from "./utils";

export async function authMiddleware(request: NextRequest, response: NextResponse) {
  const supabase = await createSSRClient();

  const isAuthenticated: boolean = (await getUserId(supabase)) !== null;

  if (request.nextUrl.pathname.startsWith("/dashboard") && !isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = routes.auth.signIn;
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
