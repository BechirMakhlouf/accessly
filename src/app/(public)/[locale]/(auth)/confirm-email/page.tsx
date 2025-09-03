import { ConfirmEmailCard } from '@/lib/auth';

export default async function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <ConfirmEmailCard email={"bechirm@proton.me"} />
        </div>
      </div>
    </div>
  )
}
