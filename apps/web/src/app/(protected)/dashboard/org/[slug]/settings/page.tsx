import { routes } from "@/lib/routes"
import { redirect } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function SettingsRootPage({ params }: Props) {
  const { slug } = await params
  redirect(routes.protected.dashboard.org.slug.settings.general(slug))
}
