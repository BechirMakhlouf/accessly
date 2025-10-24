import type { ReactNode } from "react";
import { getOrgBySlug } from '@/modules/organizations/actions'
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
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
    </div>
  )
}
