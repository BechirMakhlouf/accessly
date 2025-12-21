'use client';

import { useActiveOrg } from '@/modules/organizations';
import { OrgSlugSettings } from './org-slug-settings';
import { OrgDetailsSettings } from './org-settings-details';
import { DeleteOrgDangerZone } from './delete-org-danger-zone';
import { Skeleton } from '@/components/ui/skeleton';

export function OrgSettings() {
  const { activeOrganization: org, isLoading } = useActiveOrg();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='space-y-4'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-64' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='space-y-4'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-64' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='space-y-4'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-64' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>
    );
  }

  if (!org) {
    return null;
  }

  return (
    <div className='space-y-6'>
      <OrgDetailsSettings />
      <OrgSlugSettings />
      <DeleteOrgDangerZone />
    </div>
  );
}
