import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLayoutLoading() {
  return (
    <div className='flex min-h-[calc(100vh-64px)] w-full flex-col md:flex-row'>
      <aside className='w-full border-border border-b p-4 md:w-64 md:border-r md:border-b-0 md:p-6'>
        <nav className='flex flex-row gap-2 md:flex-col'>
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className='h-10 w-full md:w-auto' />
          ))}
        </nav>
      </aside>
      <main className='flex-1 p-4 md:p-6'>
        <div className='space-y-6'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-64' />
          <Skeleton className='h-10 w-full' />
        </div>
      </main>
    </div>
  );
}
