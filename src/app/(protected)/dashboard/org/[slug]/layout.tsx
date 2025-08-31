import { ReactNode } from 'react'
import { getOrgBySlug } from '@/modules/organizations/actions'
import { ActiveOrgProvider } from '@/modules/organizations/provider'
import { AppSidebar } from '@/components/app-sidebar'
import { routes } from '@/lib/routes'
import { redirect } from 'next/navigation'

interface Props {
  children: ReactNode
  params: Promise<{ slug: string }>
}

export default async function OrgLayout({ children, params }: Props) {
  const { slug } = await params
  const orgRes = await getOrgBySlug(slug);
  const org = orgRes?.data ?? null;
  if (!org) {
    redirect(routes.protected.dashboard.organizations.root);
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <ActiveOrgProvider initialOrg={org}>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </ActiveOrgProvider>
    </div>
  )
}
