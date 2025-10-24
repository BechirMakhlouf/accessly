import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, UserPlus, MoreHorizontal } from 'lucide-react';

export default function BoardMembersPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Board Members</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage members and their permissions for this board
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite Members
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Member
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Placeholder member cards */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src="/placeholder-avatar.jpg" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-base">John Doe</CardTitle>
                                    <CardDescription>john.doe@example.com</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Badge variant="secondary">Admin</Badge>
                                <p className="text-sm text-muted-foreground">
                                    Member since Jan 2024
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src="/placeholder-avatar.jpg" />
                                    <AvatarFallback>JS</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-base">Jane Smith</CardTitle>
                                    <CardDescription>jane.smith@example.com</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Badge variant="outline">Member</Badge>
                                <p className="text-sm text-muted-foreground">
                                    Member since Feb 2024
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src="/placeholder-avatar.jpg" />
                                    <AvatarFallback>MJ</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-base">Mike Johnson</CardTitle>
                                    <CardDescription>mike.johnson@example.com</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Badge variant="outline">Member</Badge>
                                <p className="text-sm text-muted-foreground">
                                    Member since Mar 2024
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Overview</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">3</div>
                            <div className="text-sm text-muted-foreground">Total Members</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">1</div>
                            <div className="text-sm text-muted-foreground">Admins</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">2</div>
                            <div className="text-sm text-muted-foreground">Regular Members</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
