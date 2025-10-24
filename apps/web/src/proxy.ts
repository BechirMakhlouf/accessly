import { supabaseMiddleware } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";
import { i18nMiddleware } from "./lib/i18n";
import { authMiddleware } from "./lib/auth/middleware";

export async function proxy(request: NextRequest) {
  try {
    const i18nResponse = i18nMiddleware(request);
    const supabaseResponse = await supabaseMiddleware(request, i18nResponse);
    const authResponse = await authMiddleware(request, supabaseResponse);

    authResponse.headers.append("x-pathname", request.nextUrl.pathname);

    return i18nResponse;
  } catch (e: unknown) {
    console.error("error in middleware: ", e);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
