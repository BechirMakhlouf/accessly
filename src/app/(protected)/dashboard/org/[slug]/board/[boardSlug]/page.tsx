
export default async function BoardPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Board Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your board settings, members, and access controls
                </p>
            </div>

            <div className="grid gap-6">
                <div className="rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Overview</h2>
                    <p className="text-muted-foreground">
                        This is the main dashboard for your board. Here you can see all the important information and quick actions.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-2">Quick Actions</h3>
                        <p className="text-sm text-muted-foreground">
                            Access common board management tasks
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-2">Recent Activity</h3>
                        <p className="text-sm text-muted-foreground">
                            View recent changes and updates
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-2">Statistics</h3>
                        <p className="text-sm text-muted-foreground">
                            Board usage and member statistics
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
