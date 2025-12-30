import type { Metadata } from "next";
import { Bai_Jamjuree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import { getLocale } from "@/lib/i18n";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { getPathname } from "@/lib/utils/get-pathname";
import { routes } from "@/lib/routes";

const sansFont = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-bai-jamjuree",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Accessly",
  description: "Accessly Access Management For Agile Teams",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const pathname = await getPathname();
  const locale = pathname.startsWith(routes.protected.dashboard.root)
    ? undefined
    : await getLocale((await params).locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${sansFont.variable} ${monoFont.variable} antialiased bg-background`}
      >
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
