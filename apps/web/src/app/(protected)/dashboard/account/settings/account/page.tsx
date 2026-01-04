import { Suspense } from 'react';
import { AccountSettings } from '@/modules/settings/components/account-settings';
import { AccountSettingsLoading } from '@/modules/settings/components/account-settings-loading';

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountSettingsLoading />}>
      <AccountSettings />
    </Suspense>
  );
}
