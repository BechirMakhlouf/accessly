import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/spinner';

export default function PreferencesSettingsLoading() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className='h-5 w-28' />
          </CardTitle>
          <CardDescription>
            <Skeleton className='h-4 w-52' />
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {[1, 2, 3].map(idx => (
            <div key={idx} className='flex items-center space-x-2'>
              <Skeleton className='h-4 w-4 rounded-full' />
              <Skeleton className='h-4 w-16' />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className='h-5 w-28' />
          </CardTitle>
          <CardDescription>
            <Skeleton className='h-4 w-52' />
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label>
              <Skeleton className='h-4 w-20' />
            </Label>
            <Skeleton className='w-36 h-10 rounded' />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className='flex justify-end'>
        <Button disabled>
          <Spinner />
          <Skeleton className='h-4 w-24' />
        </Button>
      </div>
    </div>
  );
}
