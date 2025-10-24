"use client";

import { getQueryClient } from "@/lib/query-client"
import {
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </TanstackQueryClientProvider>
  )
}
