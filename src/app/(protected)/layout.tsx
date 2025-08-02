import { routes } from "@/lib/routes";
import { isAuthenticated } from "@/lib/auth/actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  if (!await isAuthenticated()) redirect(routes.auth.signIn);

  return children;
}
