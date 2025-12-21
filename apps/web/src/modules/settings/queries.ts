import type { TypedSupabaseClient } from '@/lib/supabase/type';
import type { UpsertUserSettings, UserSettings } from './types';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { getUserSettings, upsertUserSettings } from './actions';
import { isNullOrUndefined } from '@/lib/utils';

export const USER_SETTINGS_KEY = ['userSettings'] as const;

export const getUserSettingsQueryOptions: () => UndefinedInitialDataOptions<UserSettings | null> =
  () => ({
    queryKey: USER_SETTINGS_KEY,
    queryFn: async () => {
      const result = await getUserSettings();

      if (result?.error) {
        throw result.error;
      } else if (isNullOrUndefined(result?.data) || isNullOrUndefined(result)) {
        return null;
      } else return result.data;
    },
    // Add caching optimizations
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

export const getUserSettingsMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (settings: Partial<UpsertUserSettings>) =>
    await upsertUserSettings(settings),
  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY }),
});

// Update user theme mutation
export const updateUserThemeMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (theme: UserSettings['theme']) => {
    await upsertUserSettings({ theme });
  },
  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY }),
});

// Update user locale mutation
export const updateUserLocaleMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: async (language: UserSettings['language']) => {
    await upsertUserSettings({ language });
  },
  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY }),
});

export const upsertUserPhone = async (
  supabase: TypedSupabaseClient,
  phone: string
) => {
  return await supabase.auth.updateUser({
    phone,
  });
};

export const updatePassword = async (
  supabase: TypedSupabaseClient,
  password: string
) => {
  return await supabase.auth.updateUser({ password });
};

export const resetEmail = async (
  supabase: TypedSupabaseClient,
  email: string
) => {
  return await supabase.auth.updateUser({ email });
};
