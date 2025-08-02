import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Current Plan Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-3" />
          <Skeleton className="h-4 w-52" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>

      {/* Plans Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-3" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Free Plan Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-32" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-20 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="mt-4 h-10 w-full rounded-md" />
              </CardContent>
            </Card>
            {/* Pro Plan Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-16" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-32" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-20 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="mt-4 h-10 w-full rounded-md" />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Skeleton (displayed as an always-on skeleton here) */}
      <Card className="border-destructive">
        <CardHeader>
          <Skeleton className="h-6 w-52 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-44" />
        </CardContent>
      </Card>
    </div>
  )
}
