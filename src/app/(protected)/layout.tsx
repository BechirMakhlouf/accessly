import { isAuthenticated } from "@/lib/auth/actions";
import { redirect } from "@/lib/i18n/navigation";
import { routes } from "@/lib/routes";
import { getLocale } from "next-intl/server";

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
