import { Skeleton } from '@/components/ui/skeleton';

export default function BoardSettingsLoadingPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6 space-y-2'>
        <Skeleton className='h-9 w-48' />
        <Skeleton className='h-4 w-96' />
      </div>

      <div className='grid gap-6'>
        {/* General Settings */}
        <div className='rounded-lg border p-6'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2 mb-4'>
              <Skeleton className='h-5 w-5' />
              <Skeleton className='h-6 w-32' />
            </div>
            <Skeleton className='h-4 w-24 mb-2' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-4 w-32 mb-2' />
            <Skeleton className='h-20 w-full' />
            <div className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <Skeleton className='h-6 w-11' />
                <Skeleton className='h-4 w-24' />
              </div>
              <div className='flex items-center space-x-2'>
                <Skeleton className='h-6 w-11' />
                <Skeleton className='h-4 w-24' />
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className='rounded-lg border p-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-24' />
              <Skeleton className='h-4 w-64' />
            </div>
            <div className='space-y-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                      <Skeleton className='h-5 w-40' />
                      <Skeleton className='h-4 w-64' />
                    </div>
                    <Skeleton className='h-6 w-11' />
                  </div>
                  {i < 2 && <Skeleton className='h-px w-full mt-4' />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className='rounded-lg border border-destructive p-6'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-5' />
              <Skeleton className='h-6 w-24' />
            </div>
            <Skeleton className='h-4 w-48' />
            <div className='rounded-lg border border-destructive/20 bg-destructive/5 p-4'>
              <div className='space-y-4'>
                <Skeleton className='h-5 w-24' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-8 w-24' />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end'>
          <Skeleton className='h-10 w-32' />
        </div>
      </div>
    </div>
  );
}
