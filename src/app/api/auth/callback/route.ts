import { NextResponse } from "next/server";
// import { checkBotId } from "botid/server";
import { getFullRoute, routes } from "@/lib/routes";
import { createSSRClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  console.log("[auth] OAuth callback route hit:", request.url);

  // const verification = await checkBotId();
  // if (verification.isBot) { return NextResponse.json({ error: "Access denied" }, { status: 403 });
  // }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  let next = url.searchParams.get("next") ?? routes.auth.signInRedirect;

  // ✅ prevent open redirects
  if (!next.startsWith("/")) next = routes.auth.signInRedirect;

  if (code) {
    const supabase = await createSSRClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }

    return NextResponse.redirect(
      getFullRoute("/auth-code-error", { error: error.code })
    );
  }

  // fallback: no code
  return NextResponse.redirect(getFullRoute("/auth-code-error"));
}
