import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { MiddlewareHandler } from "hono";
import { setCookie } from "hono/cookie";

import { env } from "../lib/env";
import { mapSameSite } from "../utils/mapCookieSameSite";
import type { Database } from "@accessly/types";

export const supabaseMiddleware: () => MiddlewareHandler =

  () => async (c, next) => {
    const supabase = createServerClient<Database>(
      env.SUPABASE_URL,
      env.SUPABASE_SECRET_KEY,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(c.req.header("Cookie") ?? "").map(
              (cookie) => ({ name: cookie.name, value: cookie.value || "" })
            );
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              setCookie(c, name, value, {
                ...options,
                sameSite: mapSameSite(options.sameSite),
              });
            });
          },
        },
      },
    );

    c.set("supabase", supabase);

    await next();
  };
