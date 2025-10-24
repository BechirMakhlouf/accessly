import { Skeleton } from '@/components/ui/skeleton';

export default function BoardsLoadingPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-6">
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
