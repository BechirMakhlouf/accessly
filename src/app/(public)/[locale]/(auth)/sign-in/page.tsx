import { SignInForm } from "@/lib/auth/components/sign-in-form";

export default function Page() {
  return (
    <div className="bg-background flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  )
}

