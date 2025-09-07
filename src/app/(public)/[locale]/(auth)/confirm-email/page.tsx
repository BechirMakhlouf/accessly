import { ConfirmEmailCard } from '@/lib/auth';
import { Suspense } from 'react';
import { Spinner } from '@/components/spinner';

interface PageProps {
  searchParams: Promise<{
    email?: string;
    type?: 'email' | 'recovery' | 'magiclink' | 'email_change';
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const email = resolvedSearchParams.email || '';
  const type = (resolvedSearchParams.type as 'email' | 'recovery' | 'magiclink' | 'email_change') || 'email';

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <Spinner />
            </div>
          }>
            <ConfirmEmailCard email={email} type={type} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
