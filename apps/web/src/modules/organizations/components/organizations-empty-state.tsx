import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';
import { ClearSearchButton } from './clear-search-button';

type OrganizationsEmptyStateProps = {
  searchQuery?: string;
};

export async function OrganizationsEmptyState({
  searchQuery,
}: OrganizationsEmptyStateProps) {
  const t = await getTranslations('organizations');
  const hasSearchQuery = !!searchQuery?.trim();

  return (
    <div className='text-center py-12'>
      <div className='mx-auto max-w-md'>
        <div className='mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4'>
          <Users className='h-6 w-6 text-muted-foreground' />
        </div>
        {hasSearchQuery ? (
          <>
            <h3 className='text-lg font-semibold mb-2'>
              {t('search.noResults.title')}
            </h3>
            <p className='text-muted-foreground mb-4'>
              {t('search.noResults.description', { query: searchQuery ?? '' })}
            </p>
            <ClearSearchButton label={t('search.clear')} />
          </>
        ) : (
          <>
            <h3 className='text-lg font-semibold mb-2'>{t('empty.title')}</h3>
            <p className='text-muted-foreground mb-4'>
              {t('empty.description')}
            </p>
            <Button asChild>
              <Link href={routes.protected.dashboard.organizations.new}>
                <Plus className='mr-2 h-4 w-4' />
                {t('actions.create')}
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
