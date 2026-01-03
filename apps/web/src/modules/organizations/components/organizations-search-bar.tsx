'use client';

import { Search } from 'lucide-react';
import { useQueryState, parseAsString } from 'nuqs';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

export function OrganizationsSearchBar() {
  const t = useTranslations('organizations');
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );

  return (
    <div className='relative'>
      <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
      <Input
        placeholder={t('search.placeholder')}
        className='pl-8 w-[300px]'
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
