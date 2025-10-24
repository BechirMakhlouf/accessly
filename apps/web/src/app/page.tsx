import { getLocale, redirect } from "@/lib/i18n";
import { routes } from "@/lib/routes";

export default async function Page(
  { params }: { params: Promise<{ locale: string }>; }
) {
  const locale = await getLocale((await params).locale)
  redirect({ href: routes.landingPage, locale });
}
