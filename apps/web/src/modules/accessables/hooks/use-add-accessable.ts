'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { createAccessableMutationOptions } from '../queries';
import type { CreateAccessableFormData } from '../schemas';

interface UseAddAccessableProps {
  organizationId: string;
  boardId?: string;
  onSuccess?: () => void;
}

export function useAddAccessable({
  organizationId,
  boardId,
  onSuccess,
}: UseAddAccessableProps) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const createMutation = useMutation(
    createAccessableMutationOptions(queryClient)
  );

  const handleSubmit = async (data: CreateAccessableFormData) => {
    try {
      await createMutation.mutateAsync({
        organization_id: organizationId,
        board_id: boardId ?? null,
        name: data.name,
        type: data.type,
        description: data.description || null,
        url: data.url || null,
        metadata: data.metadata,
      });

      toast.success(t('accessables.actions.created'));
      onSuccess?.();
    } catch {
      toast.error(t('accessables.actions.createError'));
    }
  };

  return {
    handleSubmit,
    isSubmitting: createMutation.isPending,
  };
}
