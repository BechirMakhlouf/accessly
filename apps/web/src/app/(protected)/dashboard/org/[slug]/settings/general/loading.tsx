import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export default function GeneralSettingsLoading() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-64' />
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
        </CardContent>
        <CardFooter className='border-t px-6 py-4'>
          <Skeleton className='h-10 w-32' />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-24' />
          <Skeleton className='h-4 w-80' />
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
        </CardContent>
        <CardFooter className='border-t px-6 py-4'>
          <Skeleton className='h-10 w-32' />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-28' />
          <Skeleton className='h-4 w-72' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-2'>
                <Skeleton className='h-5 w-40' />
                <Skeleton className='h-4 w-64' />
              </div>
              <Skeleton className='h-10 w-32' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
