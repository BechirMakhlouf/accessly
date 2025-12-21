import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import type { OrgRole } from '@/modules/organizations';

interface InviteMemberModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onEmailChange: (email: string) => void;
  role: OrgRole;
  onRoleChange: (role: OrgRole) => void;
  isInviting: boolean;
  onInvite: () => void;
}

export const InviteMemberModal = ({
  isOpen,
  onOpenChange,
  email,
  onEmailChange,
  role,
  onRoleChange,
  isInviting,
  onInvite,
}: InviteMemberModalProps) => {
  const t = useTranslations('org.members');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('inviteModal.title')}</DialogTitle>
          <DialogDescription>{t('inviteModal.description')}</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>{t('inviteModal.emailLabel')}</Label>
            <Input
              id='email'
              type='email'
              placeholder={t('inviteModal.emailPlaceholder')}
              value={email}
              onChange={e => onEmailChange(e.target.value)}
              disabled={isInviting}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='role'>{t('inviteModal.roleLabel')}</Label>
            <Select
              value={role}
              onValueChange={(value: 'admin' | 'member') => onRoleChange(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='member'>{t('roles.member')}</SelectItem>
                <SelectItem value='admin'>{t('roles.admin')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('inviteModal.cancel')}
          </Button>
          <Button onClick={onInvite} disabled={!email.trim() || isInviting}>
            {isInviting ? (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            ) : (
              <Mail className='h-4 w-4 mr-2' />
            )}
            {t('inviteModal.sendInvite')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
