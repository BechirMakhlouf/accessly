"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfileQueryOptions,
  getProfileMutationOptions,
  getUserAvatarMutationOptions,
  updateFullNameMutationOptions,
} from "../queries";

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  return {
    profile: useQuery(getProfileQueryOptions()),
    setProfile: useMutation(getProfileMutationOptions(queryClient)),
    setUserAvatar: useMutation(getUserAvatarMutationOptions(queryClient)),
    setFullName: useMutation(updateFullNameMutationOptions(queryClient)),
  };
};
