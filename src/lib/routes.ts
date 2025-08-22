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
    signInRedirect: "/dashboard",
    signOutRedirect: "/sign-in",
    forgotPassword: "/forgot-password",
    authCodeError: "/auth-code-error",
    confirmEmail: "/confirm-email",
    updatePassword: "/update-password",
    signUpSuccess: "/sign-up-success",
  },

  protected: {
    dashboard: {
      root: "/dashboard",
      account: {
        root: "/dashboard/account",
        settings: {
          root: "/dashboard/account/settings/",
          general: "/dashboard/account/settings/general",
          account: "/dashboard/account/settings/account",
          preferences: "/dashboard/account/settings/preferences",
          billing: "/dashboard/account/settings/billing",
        }
      },
      organizations: {
        root: "/dashboard/organizations",
        new: "/dashboard/organizations/new"
      },
      org: {
        root: "/org",
        slug: {
          root: (slug: string) => `/dashboard/org/${slug}/`,
          members: (slug: string) => `/dashboard/org/${slug}/members`,
          settings: {
            root: (slug: string) => `/dashboard/org/${slug}/settings`,
            general: (slug: string) => `/dashboard/org/${slug}/settings/general`,
            billing: (slug: string) => `/dashboard/org/${slug}/settings/billing`,
            security: (slug: string) => `/dashboard/org/${slug}/settings/security`,
          },
        }
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

  api: {
    auth: {
      callback: "/api/auth/callback",
    },
  },
} as const;

