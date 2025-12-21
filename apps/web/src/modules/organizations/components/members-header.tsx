import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface MembersHeaderProps {
  canManageMembers: boolean;
  onInviteClick: () => void;
}

export const MembersHeader = ({
  canManageMembers,
  onInviteClick,
}: MembersHeaderProps) => {
  const t = useTranslations('org.members');

  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>{t('title')}</h1>
        <p className='text-muted-foreground'>{t('description')}</p>
      </div>
      {canManageMembers && (
        <Button onClick={onInviteClick}>
          <Plus className='h-4 w-4 mr-2' />
          {t('inviteMember')}
        </Button>
      )}
    </div>
  );
};
