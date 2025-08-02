import Link from "next/link"
import { routes } from "@/lib/routes";

export async function FloatingLogo() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Link href={routes.landingPage} className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
      </Link>
    </div>
  )
}
