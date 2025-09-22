import { Profile, UpsertProfile } from "./types";
import { QueryClient } from "@tanstack/react-query";
import {
  deleteUserAvatar,
  getProfile,
  uploadUserAvatar,
  upsertProfile,
} from "./actions";
import { isNullOrUndefined } from "@/lib/utils";

export const PROFILE_KEY = ["profile"] as const;

export const getProfileQueryOptions = () => ({
  queryKey: PROFILE_KEY,
  queryFn: async (): Promise<Profile | null> => {
    const result = await getProfile();

    if (result?.error) {
      throw result.error;
    } else if (isNullOrUndefined(result?.data) || isNullOrUndefined(result)) {
      return null;
    } else {
      return result.data;
    }
  },
});

export const getProfileMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (profile: Partial<UpsertProfile>) =>
    await upsertProfile(profile),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
});

export const getUserAvatarMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async ({ file }: { file?: File }) =>
    file ? await uploadUserAvatar(file) : await deleteUserAvatar(),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
});

// Example mutation: update profile display name
export const updateFullNameMutationOptions = (
  queryClient: QueryClient,
) => ({
  mutationFn: async (fullName: Profile["full_name"]) => {
    await upsertProfile({ full_name: fullName });
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
});
