'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useActiveOrg, useUserOrgs } from '@/modules/organizations';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import { isAdminRole } from '../utils';
import type { DeleteOrgConfirmationFormData } from '../schemas';
import { createDeleteOrgConfirmationSchema } from '../schemas';

export function DeleteOrgDangerZone() {
  const { activeOrganization: org, currentUserRole } = useActiveOrg();
  const { deleteOrganization, isDeleting } = useUserOrgs();
  const t = useTranslations('org.settings.general');
  const router = useRouter();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingOrg, setIsDeletingOrg] = useState(false);

  const canDelete = currentUserRole && isAdminRole(currentUserRole);

  const deleteOrgConfirmationSchema = createDeleteOrgConfirmationSchema();

  const form = useForm<DeleteOrgConfirmationFormData>({
    resolver: zodResolver(deleteOrgConfirmationSchema),
    defaultValues: {
      confirmName: '',
    },
  });

  const onSubmit = async (data: DeleteOrgConfirmationFormData) => {
    if (!org || data.confirmName !== org.name) return;

    setIsDeletingOrg(true);

    try {
      await deleteOrganization(org.id);

      toast.success('Organization deleted successfully');
      setIsDeleteDialogOpen(false);

      // Navigate to organizations list
      router.push(routes.protected.dashboard.organizations.root);
    } catch (error) {
      console.error('Failed to delete organization:', error);
      toast.error('Failed to delete organization');
    } finally {
      setIsDeletingOrg(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    form.reset();
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    form.reset();
  };

  if (!org) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('dangerZone.title')}</CardTitle>
          <CardDescription>{t('dangerZone.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-base font-semibold'>
                  {t('dangerZone.deleteOrg.title')}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {t('dangerZone.deleteOrg.description')}
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='destructive'
                    disabled={!canDelete}
                    onClick={handleOpenDeleteDialog}
                  >
                    {t('dangerZone.deleteOrg.button')}
                  </Button>
                </TooltipTrigger>
                {!canDelete && (
                  <TooltipContent>
                    <p>Only admins can delete organizations</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{t('dangerZone.deleteOrg.confirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('dangerZone.deleteOrg.confirmDescription')}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='confirmName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type <strong>{org.name}</strong> to confirm deletion:
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter organization name'
                        {...field}
                        className={
                          field.value && field.value !== org.name
                            ? 'border-destructive'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.confirmName &&
                        form.formState.errors.confirmName.message}
                    </FormMessage>
                    {field.value && field.value !== org.name && (
                      <p className='text-sm text-destructive'>
                        The name doesn&apos;t match. Please type the exact
                        organization name.
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <Button variant='outline' onClick={handleCloseDeleteDialog}>
              {t('dangerZone.deleteOrg.cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={form.handleSubmit(onSubmit)}
              disabled={
                form.watch('confirmName') !== org.name ||
                isDeletingOrg ||
                isDeleting
              }
            >
              {isDeletingOrg || isDeleting
                ? 'Deleting...'
                : t('dangerZone.deleteOrg.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
