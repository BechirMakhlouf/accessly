import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('org.members');

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex flex-col space-y-6'>
        {/* Header skeleton */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <div className='h-8 w-64 bg-muted animate-pulse rounded mb-2'></div>
            <div className='h-4 w-96 bg-muted animate-pulse rounded'></div>
          </div>
          <div className='h-10 w-32 bg-muted animate-pulse rounded'></div>
        </div>

        {/* Search bar skeleton */}
        <div className='h-10 w-full bg-muted animate-pulse rounded'></div>

        {/* Table skeleton */}
        <div className='border border-border rounded-lg'>
          <div className='flex items-center justify-center py-12'>
            <div className='flex flex-col items-center space-y-2'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>{t('loading')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
