import { routes } from "@/lib/routes";
import { isAuthenticated } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { FloatingLogo } from "@/components/floating-logo";
import { UserLoggedInListener } from "@/components/user-logged-in-listener";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  if (await isAuthenticated()) redirect(routes.protected.dashboard.root);

  return <>
  {/* Mount the login event listener while on auth pages */}
  <UserLoggedInListener />
    <FloatingLogo />
    {children}
  </>;
}

