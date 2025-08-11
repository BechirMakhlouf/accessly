import { routes } from "@/lib/routes"
import { redirect } from "next/navigation"

export default function App() {
  redirect(routes.protected.dashboard.organizations.root)
}
