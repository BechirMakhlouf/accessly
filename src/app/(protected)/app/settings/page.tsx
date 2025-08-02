import { routes } from "@/lib/routes"
import { redirect } from "next/navigation"

export default function SettingsPage() {
  redirect(routes.protected.app.settings.general);
}
