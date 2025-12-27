import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { ServiceResult } from '@/lib/types';
import type { Accessable, AccessableInsert, AccessableUpdate } from './types';
import {
  getAccessableById,
  getAccessablesByBoardId,
  getAccessablesByOrganizationId,
  createAccessable,
  updateAccessable,
  deleteAccessable,
} from './actions';

export const accessablesKeys = {
  all: ['accessables'] as const,
  byId: (id: string) => [...accessablesKeys.all, 'byId', id] as const,
  byBoard: (boardId: string) =>
    [...accessablesKeys.all, 'byBoard', boardId] as const,
  byOrganization: (organizationId: string) =>
    [...accessablesKeys.all, 'byOrganization', organizationId] as const,
};

export function useAccessable(
  id: string,
  options?: Omit<
    UseQueryOptions<ServiceResult<Accessable>>,
    'queryKey' | 'queryFn'
  >
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
    'queryKey' | 'queryFn'
  >
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
    'queryKey' | 'queryFn'
  >
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
    onSuccess: result => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: accessablesKeys.byBoard(result.data.board_id),
        });
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
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: accessablesKeys.byId(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: accessablesKeys.byBoard(result.data.board_id),
        });
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
    mutationFn: (id: string) => deleteAccessable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accessablesKeys.all,
      });
    },
  });
}
