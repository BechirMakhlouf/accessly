import { Skeleton } from '@/components/ui/skeleton';
import { InvitesLoadingState } from '@/modules/organizations/components/invites-loading-state';

export default function InvitesLoadingPage() {
  return (
    <div className='w-full flex justify-center'>
      <div className='flex w-full xl:w-3/4 mx-12'>
        <div className='min-h-screen bg-background w-full'>
          <main className='container py-8 w-full'>
            <div className='max-w-4xl mx-auto'>
              <div className='mb-8'>
                <Skeleton className='h-8 w-64 mb-2' />
                <Skeleton className='h-4 w-96' />
              </div>
              <InvitesLoadingState />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
