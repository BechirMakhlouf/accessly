import { QueryClient, UndefinedInitialDataOptions } from '@tanstack/react-query';
import {
  getBoardBySlug,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  updateBoardMemberRole,
  hardDeleteBoard
} from './actions';
import { Board, BoardInput, BoardUpdate, BoardRole } from './types';

// Query Keys
export const BOARD_KEY = (boardId: string) => ['board', boardId] as const;
export const BOARD_BY_SLUG_KEY = (slug: string) => ['board-by-slug', slug] as const;

// Get board by slug query options
export const getBoardBySlugQueryOptions = (slug: string): UndefinedInitialDataOptions<Board | null> => ({
  queryKey: BOARD_BY_SLUG_KEY(slug),
  queryFn: async () => {
    try {
      const board = await getBoardBySlug(slug); // returns Board or throws
      return board || null;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'unknown_error';
      throw new Error(message);
    }
  },
  enabled: !!slug,
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

// Get board by id query options
export const getBoardQueryOptions = (boardId: string): UndefinedInitialDataOptions<Board | null> => ({
  queryKey: BOARD_KEY(boardId),
  queryFn: async () => {
    try {
      const board = await getBoardById(boardId); // returns Board or throws
      return board || null;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'unknown_error';
      throw new Error(message);
    }
  },
  enabled: !!boardId,
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

// Mutations
export const createBoardMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (input: BoardInput) => await createBoard(input),
  onSuccess: (data: { data?: Board; error?: string } | null) => {
    if (!data?.error && data?.data?.id) {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY(data.data.id) });
      if (data.data.slug) {
        queryClient.invalidateQueries({ queryKey: BOARD_BY_SLUG_KEY(data.data.slug) });
      }
    }
  },
});

export const updateBoardMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ boardId, updates }: { boardId: string; updates: BoardUpdate }) => await updateBoard(boardId, updates),
  onSuccess: (data: { data?: Board; error?: string } | null, { boardId }: { boardId: string; updates: BoardUpdate }) => {
    if (!data?.error) {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY(boardId) });
      if (data?.data?.slug) {
        queryClient.invalidateQueries({ queryKey: BOARD_BY_SLUG_KEY(data.data.slug) });
      }
    }
  },
});

export const deleteBoardMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (boardId: string) => await deleteBoard(boardId),
  onSuccess: (data: { data?: null; error?: string } | null, boardId: string) => {
    if (!data?.error) {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY(boardId) });
    }
  },
});

export const hardDeleteBoardMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (boardId: string) => await hardDeleteBoard(boardId),
  onSuccess: (data: { data?: null; error?: string } | null, boardId: string) => {
    if (!data?.error) {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY(boardId) });
    }
  },
});

export const updateBoardMemberRoleMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ boardId, memberId, newRole }: { boardId: string; memberId: string; newRole: BoardRole }) => 
    await updateBoardMemberRole(boardId, memberId, newRole),
  onSuccess: (data: { data?: { role: BoardRole }; error?: string } | null, { boardId }: { boardId: string; memberId: string; newRole: BoardRole }) => {
    if (!data?.error) {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY(boardId) });
    }
  },
});
