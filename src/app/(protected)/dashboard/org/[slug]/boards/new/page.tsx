"use client";

import { NewBoardForm } from '@/modules/boards/components/new-board-form';
import { useActiveOrganization } from '@/modules/organizations';
import { Spinner } from '@/components/spinner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function NewBoardPage() {
  const { activeOrganization, isLoading } = useActiveOrganization();
  const t = useTranslations('board.form');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!activeOrganization) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
        {t('errors.genericError')}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <NewBoardForm organizationId={activeOrganization.id} />
        </CardContent>
      </Card>
    </div>
  );
}
