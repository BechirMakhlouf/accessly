import { isAuthenticated } from "@/lib/auth/actions";
import { redirect } from "@/lib/i18n/navigation";
import { routes } from "@/lib/routes";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  if (!await isAuthenticated())
    redirect(routes.auth.signIn);

  return <> {children} </>

}
