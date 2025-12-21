'use client';

import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

interface OrganizationsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateOrganization: () => void;
}

export function OrganizationsHeader({
  searchQuery,
  onSearchChange,
  onCreateOrganization,
}: OrganizationsHeaderProps) {
  const t = useTranslations('organizations');

  return (
    <div className='flex items-center justify-between mb-8 gap-x-4'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='text-muted-foreground mt-2'>{t('description')}</p>
      </div>
      <div className='flex items-center space-x-3'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder={t('search.placeholder')}
            className='pl-8 w-[300px]'
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={onCreateOrganization}>
          <Plus className='mr-2 h-4 w-4' />
          {t('actions.create')}
        </Button>
      </div>
    </div>
  );
}
