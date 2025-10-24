import { Skeleton } from '@/components/ui/skeleton';

export default function BoardAccessablesLoadingPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-40" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-5" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-lg border p-6">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        </div>
    );
}
