import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function BoardsPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Boards</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your organization&apos;s boards and access controls
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Board
                </Button>
            </div>

            <div className="grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Placeholder board cards */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Alpha</CardTitle>
                            <CardDescription>
                                Main project board for development team
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                This is a placeholder board for demonstration purposes.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Marketing Board</CardTitle>
                            <CardDescription>
                                Marketing campaigns and content planning
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                This is a placeholder board for demonstration purposes.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground">
                                Create New Board
                            </CardTitle>
                            <CardDescription>
                                Start a new board for your team
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Board
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
