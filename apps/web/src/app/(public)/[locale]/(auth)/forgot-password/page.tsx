import { ForgotPasswordForm } from '@/lib/auth';
import { ForgotPasswordFormLoading } from '@/lib/auth/components/forgot-password-form-loading';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div className='flex min-h-[80svh] w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <Suspense fallback={<ForgotPasswordFormLoading />}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
