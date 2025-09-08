import { SignInForm } from "@/lib/auth";
import { getFullRoute } from "@/lib/routes";
import { routes } from "@/lib/routes";

export default function Page() {
  console.error("[auth][oauth] signing with oauth with redirectTo: ", getFullRoute(routes.api.auth.callback));
  return (
    <div className="bg-background flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  )
}

