import { Profile, UpsertProfile } from "./types";
import { QueryClient, UndefinedInitialDataOptions } from "@tanstack/react-query";
import { deleteUserAvatar, getProfile, uploadUserAvatar, upsertProfile } from "./actions";

export const PROFILE_KEY = ["profile"] as const;

export const getProfileQueryOptions: () =>
  UndefinedInitialDataOptions<Profile | null> =
  () => ({
    queryKey: PROFILE_KEY,
    queryFn: async () => await getProfile(),
  });

export const getProfileMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (profile: Partial<UpsertProfile>) => await upsertProfile(profile),
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
