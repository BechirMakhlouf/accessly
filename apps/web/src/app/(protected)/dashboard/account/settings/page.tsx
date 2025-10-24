import { routes } from "@/lib/routes"
import { redirect } from "next/navigation"


export default function AccountSettingsPage() {
  redirect(routes.protected.dashboard.account.settings.general)
}
