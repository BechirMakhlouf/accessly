import { Suspense } from 'react';
import { GeneralSettings } from '@/modules/profiles/components/general-settings';
import { GeneralSettingsLoading } from '@/modules/profiles/components/general-settings-loading';

export default function GeneralSettingsPage() {
  return (
    <Suspense fallback={<GeneralSettingsLoading />}>
      <GeneralSettings />
    </Suspense>
  );
}
