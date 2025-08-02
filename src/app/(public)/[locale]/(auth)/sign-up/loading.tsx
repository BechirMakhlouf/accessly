export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpFormLoading />
      </div>
    </div>
  )
}
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function SignUpFormLoading({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <Card>
        <CardHeader className="text-center">
          <Skeleton className="h-8 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-44 mx-auto" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-28 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Button className="w-full" disabled>
              <span className="animate-pulse">Create an account...</span>
            </Button>
            <Skeleton className="h-4 w-40 mx-auto mt-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
