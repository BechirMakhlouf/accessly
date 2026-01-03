'use client';

import { useRouter } from 'next/navigation';
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
import { routes } from '@/lib/routes';
import { useUserOrgs } from '../hooks/use-user-orgs';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

type OrgCardLeaveDialogProps = {
  orgId: string;
  orgName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OrgCardLeaveDialog({
  orgId,
  orgName,
  open,
  onOpenChange,
}: OrgCardLeaveDialogProps) {
  const { leaveOrganization } = useUserOrgs();
  const t = useTranslations('organizations');
  const router = useRouter();

  const handleLeaveOrganization = async () => {
    try {
      const result = await leaveOrganization(orgId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t('members.actions.leftOrganization'));
        onOpenChange(false);
        router.push(routes.protected.dashboard.organizations.root);
      }
    } catch (error) {
      console.error('Failed to leave organization:', error);
      toast.error(t('members.actions.leaveOrganizationError'));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('card.leaveDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('card.leaveDialog.description', { name: orgName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('card.leaveDialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeaveOrganization}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {t('card.leaveDialog.leave')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
