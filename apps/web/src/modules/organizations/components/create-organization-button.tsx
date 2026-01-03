import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';

export async function CreateOrganizationButton() {
  const t = await getTranslations('organizations');

  return (
    <Button asChild>
      <Link href={routes.protected.dashboard.organizations.new}>
        <Plus className='mr-2 h-4 w-4' />
        {t('actions.create')}
      </Link>
    </Button>
  );
}
