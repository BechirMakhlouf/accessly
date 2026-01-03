import { Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { OrgWithMembers } from '../types';
import { routes } from '@/lib/routes';
import { OrgCardMenu } from './org-card-menu';

type OrganizationCardProps = {
  organization: OrgWithMembers;
};

export async function OrganizationCard({
  organization,
}: OrganizationCardProps) {
  const t = await getTranslations('organizations');
  const locale = await getLocale();

  const memberCount = organization.organization_members?.length || 0;

  const formattedDate = new Date(organization.created_at).toLocaleDateString(
    locale,
    {
      month: 'short',
      year: 'numeric',
    }
  );

  return (
    <Card className='group relative overflow-hidden transition-all hover:shadow-md'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage
                src={organization.icon_url || '/placeholder.svg'}
                alt={organization.name}
              />
              <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                {organization.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
              <div className='flex items-center space-x-2'>
                <CardTitle className='text-base leading-none'>
                  <Link
                    href={routes.protected.dashboard.org.slug.root(
                      organization.slug || ''
                    )}
                    className='hover:underline'
                  >
                    {organization.name}
                  </Link>
                </CardTitle>
              </div>
              <div className='text-xs text-muted-foreground'>
                {organization.slug}
              </div>
            </div>
          </div>
          <OrgCardMenu
            orgId={organization.id}
            orgName={organization.name}
            orgSlug={organization.slug || ''}
          />
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        <CardDescription className='mb-4 line-clamp-2'>
          {organization.description || t('card.noDescription')}
        </CardDescription>
        <div className='flex items-center justify-between text-sm text-muted-foreground'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-1'>
              <Users className='h-3 w-3' />
              <span>
                {memberCount}{' '}
                {memberCount !== 1 ? t('card.members') : t('card.member')}
              </span>
            </div>
          </div>
          <div className='flex items-center space-x-1'>
            <Calendar className='h-3 w-3' />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
