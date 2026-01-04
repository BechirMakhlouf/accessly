import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AccountSettingsLoading() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>
            Update your email address for account notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-10 w-full max-w-md' />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Reset your password by sending a reset link to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-10 w-40' />
        </CardContent>
      </Card>

      <Card className='border-destructive'>
        <CardHeader>
          <CardTitle className='text-destructive'>Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-10 w-36' />
        </CardContent>
      </Card>
    </div>
  );
}
