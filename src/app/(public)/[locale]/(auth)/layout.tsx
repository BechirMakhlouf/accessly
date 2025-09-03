import { routes } from "@/lib/routes";
import { isAuthenticated } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { FloatingLogo } from "@/components/floating-logo";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  if (await isAuthenticated()) redirect(routes.protected.dashboard.root);

  return <>
    <FloatingLogo />
    {children}
  </>;
}

