import { env } from "./env"

function joinPath(base: string, path: string): string {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

type Params = Record<string, string | number | boolean | undefined>;

export function getFullRoute(path: Route, params?: Params): string {
  const url = new URL(env.NEXT_PUBLIC_SITE_URL);
  url.pathname = joinPath(url.pathname, path);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

///bayi: to make a type for our routes
type ValueOf<T> = T extends object
  ? { [K in keyof T]: ValueOf<T[K]> }[keyof T]
  : T;

export type Route = ValueOf<typeof routes>;

export const routes = {
  // Public routes
  landingPage: "/",

  // Authentication routes
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    signInRedirect: "/app",
    signOutRedirect: "/sign-in",
    forgotPassword: "/forgot-password",
    authCodeError: "/auth-code-error",
    confirmEmail: "/confirm-email",
    updatePassword: "/update-password",
    signUpSuccess: "/sign-up-success",
  },

  protected: {
    app: {
      root: "/app",
      settings: {
        root: "/app/settings",
        general: "/app/settings/general",
        account: "/app/settings/account",
        preferences: "/app/settings/preferences",
        billing: "/app/settings/billing",
      },
      team: {
        root: "/app/team"
      }
    }
  },

  marketing: {
    features: "/",
    pricing: "/",
    docs: "/",
    blog: "/",
    about: "/",
    contact: "/",
  },

  // Legal pages
  // legal: {
  //   terms: "/terms",
  //   privacy: "/privacy",
  //   cookies: "/cookies",
  // },

  api: {
    auth: {
      callback: "/api/auth/callback",
    },
  },
} as const;

