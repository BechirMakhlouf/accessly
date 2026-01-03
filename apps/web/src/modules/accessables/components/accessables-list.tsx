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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { getIconUrl } from '../utils';
import { toast } from 'sonner';

interface AccessableRowProps {
  accessable: Accessable;
}

function AccessableRow({ accessable }: AccessableRowProps) {
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
      <TableRow>
        <TableCell>
          <div className='flex items-center gap-3'>
            <div className='h-8 w-8 shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden'>
              {iconUrl && !iconError ? (
                <Image
                  src={iconUrl}
                  alt=''
                  width={20}
                  height={20}
                  className='object-contain'
                  onError={() => setIconError(true)}
                  unoptimized
                />
              ) : (
                <Globe className='h-4 w-4 text-muted-foreground' />
              )}
            </div>
            <span className='font-medium'>{accessable.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant='secondary'>{accessable.type}</Badge>
        </TableCell>
        <TableCell className='max-w-[200px] truncate text-muted-foreground'>
          {accessable.description || t('accessables.table.noDescription')}
        </TableCell>
        <TableCell className='max-w-[200px]'>
          {accessable.url ? (
            <a
              href={accessable.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-muted-foreground hover:text-primary truncate block'
            >
              {accessable.url}
            </a>
          ) : (
            <span className='text-muted-foreground'>
              {t('accessables.table.noUrl')}
            </span>
          )}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8'
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
        </TableCell>
      </TableRow>

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

interface AccessablesListProps {
  accessables: Accessable[];
}

export function AccessablesList({ accessables }: AccessablesListProps) {
  const t = useTranslations('accessables.table');

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('type')}</TableHead>
          <TableHead>{t('description')}</TableHead>
          <TableHead>{t('url')}</TableHead>
          <TableHead className='w-[50px]'>{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accessables.map(accessable => (
          <AccessableRow key={accessable.id} accessable={accessable} />
        ))}
      </TableBody>
    </Table>
  );
}
