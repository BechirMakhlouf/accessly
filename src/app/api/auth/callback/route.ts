import { getFullRoute } from '@/lib/routes'
import { createSSRClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkBotId } from 'botid/server';

export async function GET(request: Request) {
  console.log("[auth] oauth callback route hit", request);
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/app'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/app'
  }

  if (code) {
    const supabase = await createSSRClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        console.warn("not forwardedHost header, using origin")
        return NextResponse.redirect(getFullRoute("/app"));
      }
    }

    return NextResponse.redirect(getFullRoute("/auth-code-error", { error: error.code }))
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(getFullRoute("/auth-code-error"))
}
