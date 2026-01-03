'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Pencil,
  Globe,
} from 'lucide-react';
import Image from 'next/image';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Accessable } from '../types';
import { deleteAccessableMutationOptions } from '../queries';
import { toast } from 'sonner';
import { getIconUrl } from '../utils';

interface AccessableCardProps {
  accessable: Accessable;
}

export function AccessableCard({ accessable }: AccessableCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [iconError, setIconError] = useState(false);
  const t = useTranslations();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    deleteAccessableMutationOptions(queryClient)
  );

  const iconUrl = useMemo(() => getIconUrl(accessable), [accessable]);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        id: accessable.id,
        organizationId: accessable.organization_id,
        boardId: accessable.board_id,
      });
      toast.success(t('accessables.actions.deleted'));
      setShowDeleteDialog(false);
    } catch {
      toast.error(t('accessables.actions.deleteError'));
    }
  };

  return (
    <>
      <Card className='group relative overflow-hidden transition-all hover:shadow-md'>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='flex items-start gap-3 flex-1 min-w-0'>
              <div className='h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden'>
                {iconUrl && !iconError ? (
                  <Image
                    src={iconUrl}
                    alt=''
                    width={24}
                    height={24}
                    className='object-contain'
                    onError={() => setIconError(true)}
                    unoptimized
                  />
                ) : (
                  <Globe className='h-5 w-5 text-muted-foreground' />
                )}
              </div>
              <div className='flex-1 space-y-1 min-w-0'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-base leading-none truncate'>
                    {accessable.name}
                  </CardTitle>
                  <Badge variant='secondary' className='shrink-0'>
                    {accessable.type}
                  </Badge>
                </div>
                {accessable.description && (
                  <CardDescription className='line-clamp-2'>
                    {accessable.description}
                  </CardDescription>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 shrink-0'
                  aria-label={t('accessables.table.actions')}
                >
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {accessable.url && (
                  <>
                    <DropdownMenuItem asChild>
                      <a
                        href={accessable.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center'
                      >
                        <ExternalLink className='h-4 w-4 mr-2' />
                        {t('accessables.table.viewUrl')}
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem disabled>
                  <Pencil className='h-4 w-4 mr-2' />
                  {t('accessables.table.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className='text-destructive focus:text-destructive'
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  {t('accessables.table.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        {accessable.url && (
          <CardContent className='pb-3'>
            <a
              href={accessable.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-muted-foreground hover:text-primary truncate block'
            >
              {accessable.url}
            </a>
          </CardContent>
        )}
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('accessables.deleteDialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('accessables.deleteDialog.description', {
                name: accessable.name,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('accessables.deleteDialog.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteMutation.isPending
                ? t('accessables.deleteDialog.deleting')
                : t('accessables.deleteDialog.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
