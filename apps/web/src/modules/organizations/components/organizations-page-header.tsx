import { getTranslations } from 'next-intl/server';

import { OrganizationsSearchBar } from './organizations-search-bar';
import { CreateOrganizationButton } from './create-organization-button';

export async function OrganizationsPageHeader() {
  const t = await getTranslations('organizations');

  return (
    <div className='mb-8'>
      <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
          <p className='text-muted-foreground'>{t('description')}</p>
        </div>
        <div className='flex items-center space-x-4'>
          <OrganizationsSearchBar />
          <CreateOrganizationButton />
        </div>
      </div>
    </div>
  );
}
