"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { getNotificationsForUserQueryOptions } from "../queries";

export function useUserNotifications() {
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const {
    data = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    ...getNotificationsForUserQueryOptions(),
    enabled: !!userId,
  });

  return {

    notifications: data ?? [],
    isLoading: isLoading || isFetching,
    error,
    refetch,
  };
}


