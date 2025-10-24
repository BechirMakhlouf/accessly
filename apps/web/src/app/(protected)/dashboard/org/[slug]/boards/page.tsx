"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Eye, EyeOff, Calendar } from 'lucide-react';
import { useActiveOrgBoards, CreateBoardModal } from '@/modules/boards';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import { useActiveOrg } from '@/modules/organizations/hooks/use-active-org';
import type { BoardVisibility } from '@/modules/boards/types';

export default function BoardsPage() {
    const t = useTranslations('boards');
    const router = useRouter();
    const { activeOrganization } = useActiveOrg();
    const { boards, isLoading, error } = useActiveOrgBoards();

    const handleBoardClick = (boardSlug: string) => {
        if (activeOrganization?.slug) {
            router.push(routes.protected.dashboard.org.slug.board.root(activeOrganization.slug, boardSlug));
        }
    };

    const handleCreateBoardSuccess = () => {
        // The modal will handle closing and the hook will refetch data
        // Optionally navigate to the newly created board
    };

    const getVisibilityIcon = (visibility: BoardVisibility) => {
        return visibility === "public" ? (
            <Eye className="h-4 w-4" />
        ) : (
            <EyeOff className="h-4 w-4" />
        );
    };

    const getVisibilityLabel = (visibility: BoardVisibility) => {
        return visibility === "public" ? t("visibility.public") : t("visibility.private");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (error) {
        return (
            <div className="container mx-auto py-6">
                <Alert variant="destructive">
                    <AlertDescription>
                        {t("errors.failedToLoad")}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{t("title")}</h1>
                    <p className="text-muted-foreground mt-2">
                        {t("description")}
                    </p>
                </div>
                <CreateBoardModal
                    trigger={
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t("actions.create")}
                        </Button>
                    }
                    onSuccess={handleCreateBoardSuccess}
                />
            </div>

            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full mt-2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3 mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : boards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">{t("empty.title")}</h3>
                        <p className="text-muted-foreground mb-6">{t("empty.description")}</p>
                        <CreateBoardModal
                            trigger={
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t("actions.create")}
                                </Button>
                            }
                            onSuccess={handleCreateBoardSuccess}
                        />
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {boards.map((board) => (
                        <Card
                            key={board.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleBoardClick(board.slug)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="line-clamp-1">{board.title}</CardTitle>
                                        {board.description && (
                                            <CardDescription className="line-clamp-2 mt-1">
                                                {board.description}
                                            </CardDescription>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                        {getVisibilityIcon(board.visibility)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(board.created_at)}</span>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <span className="text-xs text-muted-foreground">
                                            {getVisibilityLabel(board.visibility)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Create new board card */}
                    <CreateBoardModal
                        trigger={
                            <Card className="border-dashed cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-muted-foreground">
                                        {t("actions.create")}
                                    </CardTitle>
                                    <CardDescription>
                                        Start a new board for your team
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t("actions.create")}
                                    </Button>
                                </CardContent>
                            </Card>
                        }
                        onSuccess={handleCreateBoardSuccess}
                    />
                </div>
            )}
        </div>
    );
}
