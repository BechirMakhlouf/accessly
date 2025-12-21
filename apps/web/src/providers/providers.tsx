import { AuthProvider } from '@/lib/auth';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { QueryClientProvider } from './query-client-provider';
import { SettingsProvider } from '@/modules/settings/provider';

export async function Providers({ children }: React.PropsWithChildren) {
  return (
    <>
      <QueryClientProvider>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <Toaster />
              <SettingsProvider />
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </QueryClientProvider>
    </>
  );
}
