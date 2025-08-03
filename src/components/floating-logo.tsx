import Link from "next/link"
import { routes } from "@/lib/routes";
import { Lock } from "lucide-react";

export async function FloatingLogo() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Link href={routes.landingPage} className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Accessly
          </span>
        </div>
      </Link>
    </div>
  )
}
