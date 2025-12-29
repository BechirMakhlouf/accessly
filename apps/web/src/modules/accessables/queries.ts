import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { ServiceResult } from "@/lib/types";
import type { Accessable, AccessableInsert, AccessableUpdate } from "./types";
import {
  getAccessableById,
  getAccessablesByBoardId,
  getAccessablesByOrganizationId,
  createAccessable,
  updateAccessable,
  deleteAccessable,
} from "./actions";

type AccessablesListResult = ServiceResult<Accessable[]>;

export const accessablesKeys = {
  all: ["accessables"] as const,
  byId: (id: string) => [...accessablesKeys.all, "byId", id] as const,
  byBoard: (boardId: string) =>
    [...accessablesKeys.all, "byBoard", boardId] as const,
  byOrganization: (organizationId: string) =>
    [...accessablesKeys.all, "byOrganization", organizationId] as const,
};

export function useAccessable(
  id: string,
  options?: Omit<
    UseQueryOptions<ServiceResult<Accessable>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: accessablesKeys.byId(id),
    queryFn: () => getAccessableById(id),
    ...options,
  });
}

export function useBoardAccessables(
  boardId: string,
  options?: Omit<
    UseQueryOptions<ServiceResult<Accessable[]>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: accessablesKeys.byBoard(boardId),
    queryFn: () => getAccessablesByBoardId(boardId),
    ...options,
  });
}

export function useOrganizationAccessables(
  organizationId: string,
  options?: Omit<
    UseQueryOptions<ServiceResult<Accessable[]>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: accessablesKeys.byOrganization(organizationId),
    queryFn: () => getAccessablesByOrganizationId(organizationId),
    ...options,
  });
}

export function useCreateAccessable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AccessableInsert) => createAccessable(input),
    onMutate: async (newAccessable) => {
      const orgKey = accessablesKeys.byOrganization(
        newAccessable.organization_id,
      );
      const boardKey = newAccessable.board_id
        ? accessablesKeys.byBoard(newAccessable.board_id)
        : null;

      await queryClient.cancelQueries({ queryKey: orgKey });
      if (boardKey) {
        await queryClient.cancelQueries({ queryKey: boardKey });
      }

      const previousOrgAccessables =
        queryClient.getQueryData<AccessablesListResult>(orgKey);
      const previousBoardAccessables = boardKey
        ? queryClient.getQueryData<AccessablesListResult>(boardKey)
        : null;

      const optimisticAccessable: Accessable = {
        id: `temp-${Date.now()}`,
        organization_id: newAccessable.organization_id,
        board_id: newAccessable.board_id ?? null,
        user_id: newAccessable.user_id ?? "",
        name: newAccessable.name ?? "",
        type: newAccessable.type ?? "",
        description: newAccessable.description ?? null,
        url: newAccessable.url ?? null,
        owner_user_id: null,
        metadata: newAccessable.metadata ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData<AccessablesListResult>(orgKey, (old) => ({
        data: [optimisticAccessable, ...(old?.data ?? [])],
      }));

      if (boardKey) {
        queryClient.setQueryData<AccessablesListResult>(boardKey, (old) => ({
          data: [optimisticAccessable, ...(old?.data ?? [])],
        }));
      }

      return { previousOrgAccessables, previousBoardAccessables, boardKey };
    },
    onError: (_err, newAccessable, context) => {
      if (context?.previousOrgAccessables) {
        queryClient.setQueryData(
          accessablesKeys.byOrganization(newAccessable.organization_id),
          context.previousOrgAccessables,
        );
      }
      if (context?.boardKey && context?.previousBoardAccessables) {
        queryClient.setQueryData(
          context.boardKey,
          context.previousBoardAccessables,
        );
      }
    },
    onSettled: (result) => {
      if (result?.data) {
        if (result.data.board_id) {
          queryClient.invalidateQueries({
            queryKey: accessablesKeys.byBoard(result.data.board_id),
          });
        }
        queryClient.invalidateQueries({
          queryKey: accessablesKeys.byOrganization(result.data.organization_id),
        });
      }
    },
  });
}

export function useUpdateAccessable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: AccessableUpdate }) =>
      updateAccessable(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: accessablesKeys.all });

      const previousById = queryClient.getQueryData<ServiceResult<Accessable>>(
        accessablesKeys.byId(id),
      );

      if (previousById?.data) {
        queryClient.setQueryData<ServiceResult<Accessable>>(
          accessablesKeys.byId(id),
          {
            data: { ...previousById.data, ...updates },
          },
        );
      }

      return { previousById };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousById) {
        queryClient.setQueryData(
          accessablesKeys.byId(id),
          context.previousById,
        );
      }
    },
    onSettled: (result, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: accessablesKeys.byId(variables.id),
      });
      if (result?.data) {
        if (result.data.board_id) {
          queryClient.invalidateQueries({
            queryKey: accessablesKeys.byBoard(result.data.board_id),
          });
        }
        queryClient.invalidateQueries({
          queryKey: accessablesKeys.byOrganization(result.data.organization_id),
        });
      }
    },
  });
}

export function useDeleteAccessable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string;
      organizationId: string;
      boardId: string | null;
    }) => deleteAccessable(id),
    onMutate: async ({ id, organizationId, boardId }) => {
      const orgKey = accessablesKeys.byOrganization(organizationId);
      const boardKey = boardId ? accessablesKeys.byBoard(boardId) : null;

      await queryClient.cancelQueries({ queryKey: orgKey });
      if (boardKey) {
        await queryClient.cancelQueries({ queryKey: boardKey });
      }

      const previousOrgAccessables =
        queryClient.getQueryData<AccessablesListResult>(orgKey);
      const previousBoardAccessables = boardKey
        ? queryClient.getQueryData<AccessablesListResult>(boardKey)
        : null;

      queryClient.setQueryData<AccessablesListResult>(orgKey, (old) => ({
        data: (old?.data ?? []).filter((a) => a.id !== id),
      }));

      if (boardKey) {
        queryClient.setQueryData<AccessablesListResult>(boardKey, (old) => ({
          data: (old?.data ?? []).filter((a) => a.id !== id),
        }));
      }

      return { previousOrgAccessables, previousBoardAccessables, boardKey };
    },
    onError: (_err, { organizationId }, context) => {
      if (context?.previousOrgAccessables) {
        queryClient.setQueryData(
          accessablesKeys.byOrganization(organizationId),
          context.previousOrgAccessables,
        );
      }
      if (context?.boardKey && context?.previousBoardAccessables) {
        queryClient.setQueryData(
          context.boardKey,
          context.previousBoardAccessables,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: accessablesKeys.all,
      });
    },
  });
}
