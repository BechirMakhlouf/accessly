import { AppHeader } from '@/components/app-header';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='h-screen flex flex-col'>
        <AppHeader />
        {children}
      </div>
    </>
  );
}
