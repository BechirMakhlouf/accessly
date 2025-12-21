import type { TypedSupabaseClient } from '@/lib/supabase/type';
import { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { Notification } from './types';
import { getNotificationsForUser } from './actions';
import { isNullOrUndefined } from '@/lib/utils';

const USER_NOTIFICATIONS_KEY = ['user_notifications'] as const;
export const getNotificationsForUserQueryOptions: () => UndefinedInitialDataOptions<
  Notification[] | null
> = () => ({
  queryKey: USER_NOTIFICATIONS_KEY,
  queryFn: async () => {
    const result = await getNotificationsForUser();

    if (isNullOrUndefined(result)) {
      return null;
    }

    return result;
  },
});
