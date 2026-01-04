import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function ForgotPasswordFormLoading({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-48 mb-2' />
          <Skeleton className='h-4 w-56' />
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Skeleton className='h-4 w-16 mb-1' />
              <Skeleton className='h-10 w-full' />
            </div>
            <Button className='w-full' disabled>
              <span className='animate-pulse'>Send reset email...</span>
            </Button>
          </div>
          <Skeleton className='h-4 w-44 mx-auto mt-4' />
        </CardContent>
      </Card>
    </div>
  );
}
