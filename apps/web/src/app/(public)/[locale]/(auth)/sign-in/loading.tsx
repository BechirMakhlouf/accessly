import { SignInFormLoading } from '@/lib/auth/components/sign-in-form-loading';

export default function Loading() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <SignInFormLoading />
      </div>
    </div>
  );
}
