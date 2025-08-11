import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';
import { NextRequest } from 'next/server';

// Match all pathnames except for
// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
// - … the ones containing a dot (e.g. `favicon.ico`)
const matcher = /^\/((?!api|trpc|dashboard|_next|_vercel|.*\..*).*)$/;

export const i18nMiddleware = (req: NextRequest) => {
  const pathName = new URL(req.url).pathname;
  if (!matcher.test(pathName)) // skip on non-matching paths
    return;

  return createMiddleware(routing)(req)
};
