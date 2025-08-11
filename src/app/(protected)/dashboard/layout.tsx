import { routes } from "@/lib/routes";
import { isAuthenticated } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  if (!await isAuthenticated()) redirect(routes.auth.signIn);

  return <>
    <div className="h-screen flex flex-col">
      <AppHeader />
      {children}
    </div>
  </>

}
