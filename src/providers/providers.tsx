import { AuthProvider } from "@/lib/auth/provider";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner"
import { QueryClientProvider } from "./query-client-provider";
import { SettingsProvider } from "@/modules/settings/provider";

export function Providers({ children }: React.PropsWithChildren) {

  return <>
    <QueryClientProvider >
      <NextIntlClientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* <AuthProvider> */}
            {children}
            <Toaster />
            {/* </AuthProvider> */}
          </AuthProvider>
          <SettingsProvider />
        </ThemeProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  </>
}
