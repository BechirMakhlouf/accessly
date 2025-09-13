"use client";
import { useQuery } from '@tanstack/react-query';
import { getBoardBySlugQueryOptions } from '../queries';

export function useBoardBySlug(slug: string) {
  const query = useQuery({
    ...getBoardBySlugQueryOptions(slug),
    enabled: !!slug,
  });
  return {
    board: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
