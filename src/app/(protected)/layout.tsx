import { isAuthenticated } from "@/lib/auth/actions";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  if (!await isAuthenticated())
    redirect(routes.auth.signIn);

  return <>
    {children}
  </>

}
