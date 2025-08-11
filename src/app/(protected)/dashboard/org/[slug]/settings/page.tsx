import { routes } from "@/lib/routes"
import { redirect } from "next/navigation"

export default function SettingsRootPage() {
  redirect(routes.protected.dashboard.org.slug.settings.general("3"))
}
