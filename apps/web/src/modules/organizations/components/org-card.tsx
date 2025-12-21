'use client';
import { MoreHorizontal, Users, Calendar, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { OrgWithMembers } from '../types';
import { routes } from '@/lib/routes';
import { useUserOrgs } from '@/modules/organizations';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface OrganizationCardProps {
  organization: OrgWithMembers;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const { leaveOrganization } = useUserOrgs();
  const t = useTranslations('organizations');
  const router = useRouter();
  const locale = useLocale();

  // Get member count from the organization_members array
  const memberCount = organization.organization_members?.length || 0;

  // Format creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      month: 'short',
      year: 'numeric',
    });
  };

  const handleLeaveOrganization = async () => {
    try {
      const result = await leaveOrganization(organization.id);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t('members.actions.leftOrganization'));
        setShowLeaveDialog(false);
        // Redirect to organizations list
        router.push(routes.protected.dashboard.organizations.root);
      }
    } catch (error) {
      console.error('Failed to leave organization:', error);
      toast.error(t('members.actions.leaveOrganizationError'));
    }
  };

  return (
    <>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <MoreHorizontal className='h-4 w-4' />
                  <span className='sr-only'>{t('card.openMenu')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem>
                  <Link
                    href={routes.protected.dashboard.org.slug.root(
                      organization.slug || ''
                    )}
                  >
                    {t('card.viewOrganization')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={routes.protected.dashboard.org.slug.settings.root(
                      organization.slug || ''
                    )}
                  >
                    {t('card.settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='text-destructive'
                  onClick={() => setShowLeaveDialog(true)}
                >
                  <LogOut className='h-4 w-4 mr-2' />
                  {t('card.leaveOrganization')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <span>{formatDate(organization.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('card.leaveDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('card.leaveDialog.description', { name: organization.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('card.leaveDialog.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveOrganization}
              disabled={false}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {t('card.leaveDialog.leave')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
