import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2 } from 'lucide-react';

export function InvitesLoadingState() {
  return (
    <div className='space-y-4'>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className='flex items-start justify-between'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Building2 className='h-5 w-5' />
                  <Skeleton className='h-6 w-48' />
                </div>
                <Skeleton className='h-4 w-64' />
              </div>
              <Skeleton className='h-6 w-16' />
            </div>
          </CardHeader>

          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-32' />
              </div>

              <div className='flex gap-2'>
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-8 w-20' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
