import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full flex-col md:flex-row">
      <aside className="w-full border-border border-b p-4 md:w-64 md:border-r md:border-b-0 md:p-6">
        <nav className="flex flex-row gap-2 md:flex-col">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
              <CardHeader className="border-t px-6 py-4">
                <Skeleton className="h-10 w-32" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
