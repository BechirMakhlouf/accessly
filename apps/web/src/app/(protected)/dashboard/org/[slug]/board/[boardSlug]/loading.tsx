import { Skeleton } from '@/components/ui/skeleton';

export default function BoardLoadingPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6 space-y-2'>
        <Skeleton className='h-9 w-64' />
        <Skeleton className='h-4 w-96' />
      </div>

      <div className='grid gap-6'>
        <div className='rounded-lg border p-6'>
          <Skeleton className='h-6 w-24 mb-4' />
          <Skeleton className='h-4 w-full' />
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='rounded-lg border p-4'>
              <div className='space-y-2'>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='h-4 w-full' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
