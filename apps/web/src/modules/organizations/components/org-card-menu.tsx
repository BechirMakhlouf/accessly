'use client';

import { MoreHorizontal, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { routes } from '@/lib/routes';
import { useTranslations } from 'next-intl';
import { OrgCardLeaveDialog } from './org-card-leave-dialog';

type OrgCardMenuProps = {
  orgId: string;
  orgName: string;
  orgSlug: string;
};

export function OrgCardMenu({ orgId, orgName, orgSlug }: OrgCardMenuProps) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const t = useTranslations('organizations');

  return (
    <>
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
            <Link href={routes.protected.dashboard.org.slug.root(orgSlug)}>
              {t('card.viewOrganization')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={routes.protected.dashboard.org.slug.settings.root(orgSlug)}
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

      <OrgCardLeaveDialog
        orgId={orgId}
        orgName={orgName}
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
      />
    </>
  );
}
