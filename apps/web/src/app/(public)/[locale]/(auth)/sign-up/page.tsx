import { SignUpForm } from '@/lib/auth';
import { SignUpFormLoading } from '@/lib/auth/components/sign-up-form-loading';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <Suspense fallback={<SignUpFormLoading />}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
