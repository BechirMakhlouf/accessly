import { routes } from "@/lib/routes"
import { redirect } from "next/navigation"

interface Props {
  params: { slug: string }
}

export default function SettingsRootPage({ params }: Props) {
  redirect(routes.protected.dashboard.org.slug.settings.general(params.slug))
}
