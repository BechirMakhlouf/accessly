import { getLocale } from "@/lib/i18n/actions";
import { redirect } from "@/lib/i18n/navigation";
import { routes } from "@/lib/routes";

export default async function Page(
  { params }: { params: Promise<{ locale: string }>; }
) {
  const locale = await getLocale((await params).locale)
  redirect({ href: routes.landingPage, locale });
}
