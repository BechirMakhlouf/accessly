import { getQueryClient } from "@/lib/query-client";
import { getAuthUserQueryOptions } from "@/lib/auth/queries";
import { createSSRClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUserSettingsQueryOptions } from "@/modules/settings/queries";
import { getUserId } from "@/lib/supabase/utils";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await createSSRClient();

  const userId = await getUserId(supabase)
  if (!userId)
    redirect(routes.auth.signIn);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(getAuthUserQueryOptions(supabase));
  await queryClient.prefetchQuery(getUserSettingsQueryOptions(supabase, userId));

  return <>
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  </>

}
