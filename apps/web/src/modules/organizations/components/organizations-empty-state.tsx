import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface OrganizationsEmptyStateProps {
  hasSearchQuery: boolean;
  searchQuery: string;
  onClearSearch: () => void;
  onCreateOrganization: () => void;
}

export function OrganizationsEmptyState({
  hasSearchQuery,
  searchQuery,
  onClearSearch,
  onCreateOrganization,
}: OrganizationsEmptyStateProps) {
  const t = useTranslations('organizations');

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
              {t('search.noResults.description', { query: searchQuery })}
            </p>
            <Button variant='outline' onClick={onClearSearch}>
              {t('search.clear')}
            </Button>
          </>
        ) : (
          <>
            <h3 className='text-lg font-semibold mb-2'>{t('empty.title')}</h3>
            <p className='text-muted-foreground mb-4'>
              {t('empty.description')}
            </p>
            <Button onClick={onCreateOrganization}>
              <Plus className='mr-2 h-4 w-4' />
              {t('actions.create')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
