import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Skeleton className="h-9 w-64 mb-6" /> {/* Title Skeleton */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="general" disabled>
            <Skeleton className="h-5 w-20" />
          </TabsTrigger>
          <TabsTrigger value="members" disabled>
            <Skeleton className="h-5 w-20" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-48" /> {/* Card Title Skeleton */}
              </CardTitle>
              <Skeleton className="h-4 w-72 mt-2" /> {/* Card Description Skeleton */}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" /> {/* Label Skeleton */}
                <Skeleton className="h-10 w-full" /> {/* Input Skeleton */}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" /> {/* Label Skeleton */}
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" /> {/* Avatar Skeleton */}
                  <div className="grid gap-2 flex-1">
                    <Skeleton className="h-10 w-full" /> {/* Input Skeleton */}
                    <Skeleton className="h-10 w-32" /> {/* Button Skeleton */}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" /> {/* Label Skeleton */}
                <Skeleton className="h-10 w-full" /> {/* Select Skeleton */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" /> {/* Label Skeleton */}
                <Skeleton className="h-20 w-full" /> {/* Textarea Skeleton */}
              </div>
            </CardContent>
            <div className="border-t pt-6 px-6 pb-6">
              <Skeleton className="h-10 w-32" /> {/* Save Button Skeleton */}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-48" /> {/* Card Title Skeleton */}
              </CardTitle>
              <Skeleton className="h-4 w-72 mt-2" /> {/* Card Description Skeleton */}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-40" /> {/* "Current Members" title skeleton */}
                <Skeleton className="h-10 w-32" /> {/* "Invite Member" button skeleton */}
              </div>
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => ( // Render 3 member skeletons
                  <div key={i} className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar skeleton */}
                      <div>
                        <Skeleton className="h-4 w-32" /> {/* Name skeleton */}
                        <Skeleton className="h-3 w-48 mt-1" /> {/* Email skeleton */}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-[120px]" /> {/* Role select skeleton */}
                      <Skeleton className="h-8 w-8 rounded-full" /> {/* More options button skeleton */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
