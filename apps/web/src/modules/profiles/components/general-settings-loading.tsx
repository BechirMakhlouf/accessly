import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function GeneralSettingsLoading() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload or delete your profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-20 w-20 rounded-full' />
            <div className='space-x-2'>
              <Skeleton className='h-10 w-24 inline-block' />
              <Skeleton className='h-10 w-20 inline-block' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Name</CardTitle>
          <CardDescription>
            This is the name that will be displayed on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-10 w-full max-w-md' />
          </div>
          <Skeleton className='h-10 w-28' />
        </CardContent>
      </Card>
    </div>
  );
}
