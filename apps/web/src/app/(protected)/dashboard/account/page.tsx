import { routes } from '@/lib/routes';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  redirect(routes.protected.dashboard.account.settings.general);
}
