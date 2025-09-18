import { isAuthenticated } from "@/lib/auth/server";
import { redirect } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale();
  if (!await isAuthenticated())
    redirect({ href: routes.auth.signIn, locale });

  return <> {children} </>
}
