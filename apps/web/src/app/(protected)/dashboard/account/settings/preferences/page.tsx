import { Suspense } from 'react';
import { PreferencesSettings } from '@/modules/settings/components/preferences-settings';
import { PreferencesSettingsLoading } from '@/modules/settings/components/preferences-settings-loading';

export default function PreferencesPage() {
  return (
    <Suspense fallback={<PreferencesSettingsLoading />}>
      <PreferencesSettings />
    </Suspense>
  );
}
