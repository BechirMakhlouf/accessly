"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
    createBoard as createBoardAction,
    deleteBoard as deleteBoardAction,
    getBoardById as getBoardByIdAction,
    getBoardBySlug as getBoardBySlugAction,
    getBoardsByOrganizationId as getBoardsByOrganizationIdAction,
    updateBoard as updateBoardAction,
    updateBoardMemberRole as updateBoardMemberRoleAction,
} from "./actions";
import { Board, BoardInput, BoardRole, BoardUpdate } from "./types";

// Query Keys
export const BOARDS_KEY = "boards";
export const BOARD_KEY = "board";
export const ORG_BOARDS_KEY = (orgId: string) =>
    [BOARDS_KEY, "org", orgId] as const;
export const BOARD_BY_SLUG_KEY = (slug: string) =>
    [BOARD_KEY, "slug", slug] as const;
export const BOARD_BY_ID_KEY = (id: string) => [BOARD_KEY, "id", id] as const;

// Query Options
export function getBoardBySlugQueryOptions(slug: string) {
    return {
        queryKey: BOARD_BY_SLUG_KEY(slug),
        queryFn: async (): Promise<Board> => {
            const result = await getBoardBySlugAction(slug);
            if (result.error) {
                throw new Error(result.error);
            }
            if (!result.data) {
                throw new Error("Board not found");
            }
            return result.data;
        },
        enabled: !!slug,
    };
}

export function getBoardByIdQueryOptions(id: string) {
    return {
        queryKey: BOARD_BY_ID_KEY(id),
        queryFn: async (): Promise<Board> => {
            const result = await getBoardByIdAction(id);
            if (result.error) {
                throw new Error(result.error);
            }
            if (!result.data) {
                throw new Error("Board not found");
            }
            return result.data;
        },
        enabled: !!id,
    };
}

export function getOrgBoardsQueryOptions(orgId: string) {
    return {
        queryKey: ORG_BOARDS_KEY(orgId),
        queryFn: async (): Promise<Board[]> => {
            const result = await getBoardsByOrganizationIdAction(orgId);
            if (result.error) {
                throw new Error(result.error);
            }
            return result.data || [];
        },
        enabled: !!orgId,
    };
}

// Mutation Options
export function createBoardMutationOptions(
    queryClient: ReturnType<typeof useQueryClient>,
) {
    return {
        mutationFn: async (input: BoardInput): Promise<Board> => {
            const result = await createBoardAction(input);
            if (result.error) {
                throw new Error(result.error);
            }
            if (!result.data) {
                throw new Error("Failed to create board");
            }
            return result.data;
        },
        onSuccess: (newBoard: Board) => {
            // Invalidate organization boards query
            queryClient.invalidateQueries({
                queryKey: ORG_BOARDS_KEY(newBoard.organization_id),
            });
        },
    };
}

export function updateBoardMutationOptions(
    queryClient: ReturnType<typeof useQueryClient>,
) {
    return {
        mutationFn: async (
  { boardId, updates }: { boardId: string, updates: BoardUpdate },
): Promise<Board> => {
  
    const result = await updateBoardAction(updates, boardId);
    

    if (result.error) throw new Error(result.error);
    if (!result.data) {
        throw new Error("Failed to update board");
    }
    return result.data;
},

        onSuccess: (updatedBoard: Board) => {
            // Invalidate specific board queries
            queryClient.invalidateQueries({
                queryKey: BOARD_BY_ID_KEY(updatedBoard.id),
            });
            queryClient.invalidateQueries({
                queryKey: BOARD_BY_SLUG_KEY(updatedBoard.slug),
            });
            // Invalidate organization boards query
            queryClient.invalidateQueries({
                queryKey: ORG_BOARDS_KEY(updatedBoard.organization_id),
            });
        },
    };
}

export function deleteBoardMutationOptions(
    queryClient: ReturnType<typeof useQueryClient>,
) {
    return {
        mutationFn: async (boardId: string): Promise<void> => {
            const result = await deleteBoardAction(boardId);
            if (result.error) {
                throw new Error(result.error);
            }
        },
        onSuccess: () => {
            // Invalidate all board-related queries
            queryClient.invalidateQueries({
                queryKey: [BOARD_KEY],
            });
            queryClient.invalidateQueries({
                queryKey: [BOARDS_KEY],
            });
        },
    };
}

export function updateMemberRoleMutationOptions(
    queryClient: ReturnType<typeof useQueryClient>,
) {
    return {
        mutationFn: async ({
            boardId,
            memberId,
            newRole,
        }: {
            boardId: string;
            memberId: string;
            newRole: BoardRole;
        }): Promise<{ role: BoardRole }> => {
            const result = await updateBoardMemberRoleAction(
                boardId,
                memberId,
                newRole,
            );
            if (result.error) {
                throw new Error(result.error);
            }
            if (!result.data) {
                throw new Error("Failed to update member role");
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate board queries to refresh member data
            queryClient.invalidateQueries({
                queryKey: [BOARD_KEY],
            });
        },
    };
}
