import { AppSidebar } from "@/components/app-sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  // params: { slug: string }
}>) {
  return <>
    <div className="flex-1 flex overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  </>
}
