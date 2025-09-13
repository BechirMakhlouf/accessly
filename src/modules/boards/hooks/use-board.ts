"use client";
import { useQuery } from '@tanstack/react-query';
import { getBoardQueryOptions } from '../queries';

export function useBoard(boardId: string) {
  const query = useQuery({
    ...getBoardQueryOptions(boardId),
    enabled: !!boardId,
  });
  return {
    board: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
