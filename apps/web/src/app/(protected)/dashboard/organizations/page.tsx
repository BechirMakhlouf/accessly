import { Suspense } from 'react';

import { OrganizationsPageHeader } from '@/modules/organizations/components/organizations-page-header';
import { OrganizationsGrid } from '@/modules/organizations/components/organizations-grid';
import { OrganizationsEmptyState } from '@/modules/organizations/components/organizations-empty-state';
import { OrganizationsLoadingState } from '@/modules/organizations/components/organizations-loading-state';
import { getUserOrganizations } from '@/modules/organizations/data/get-user-organizations';

type OrganizationsPageProps = {
  searchParams: Promise<{ search?: string }>;
};

async function OrganizationsList({ search }: { search?: string }) {
  const organizations = await getUserOrganizations({ search });

  if (organizations.length === 0) {
    return <OrganizationsEmptyState searchQuery={search} />;
  }

  return <OrganizationsGrid organizations={organizations} />;
}

export default async function OrganizationsPage({
  searchParams,
}: OrganizationsPageProps) {
  const { search } = await searchParams;

  return (
    <div className='container mx-auto py-8'>
      <OrganizationsPageHeader />
      <Suspense key={search} fallback={<OrganizationsLoadingState />}>
        <OrganizationsList search={search} />
      </Suspense>
    </div>
  );
}
