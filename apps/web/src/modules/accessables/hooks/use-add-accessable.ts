import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCreateAccessable } from "../queries";
import type { CreateAccessableFormData } from "../schemas";

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
  const createMutation = useCreateAccessable();

  const handleSubmit = async (data: CreateAccessableFormData) => {
    const result = await createMutation.mutateAsync({
      organization_id: organizationId,
      board_id: boardId ?? null,
      name: data.name,
      type: data.type,
      description: data.description || null,
      url: data.url || null,
      metadata: data.metadata,
    });

    if (result.error) {
      toast.error(t("accessables.actions.createError"));
      return;
    }

    toast.success(t("accessables.actions.created"));
    onSuccess?.();
  };

  return {
    handleSubmit,
    isSubmitting: createMutation.isPending,
  };
}
