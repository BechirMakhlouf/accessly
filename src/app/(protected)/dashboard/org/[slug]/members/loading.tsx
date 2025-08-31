import { Skeleton } from "@/components/ui/skeleton"

export default function MembersLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Search and Actions Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
        </div>

        {/* Table Skeleton */}
        <div className="border border-border rounded-lg">
          <div className="p-4">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-20" />
            <div className="flex items-center space-x-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}
