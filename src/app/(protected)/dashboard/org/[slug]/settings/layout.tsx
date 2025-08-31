"use client";

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useActiveOrganization } from "@/modules/organizations"
import { routes } from "@/lib/routes"
import { useTranslations } from "next-intl"

interface SidebarLink {
  href: string
  label: string
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { activeOrganization: org } = useActiveOrganization();
  const pathname = usePathname();
  const t = useTranslations("org.settings");

  if (!org) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Organization not found</h1>
        </div>
      </div>
    );
  }

  const sidebarLinks: SidebarLink[] = [
    { 
      href: routes.protected.dashboard.org.slug.settings.general(org.slug), 
      label: t("general.title") 
    },
    { 
      href: routes.protected.dashboard.org.slug.settings.security(org.slug), 
      label: t("security.title") 
    },
    { 
      href: routes.protected.dashboard.org.slug.settings.billing(org.slug), 
      label: t("billing.title") 
    },
    { 
      href: routes.protected.dashboard.org.slug.settings.integrations(org.slug), 
      label: t("integrations.title") 
    },
  ]

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full flex-col md:flex-row">
      <aside className="w-full border-border border-b p-4 md:w-64 md:border-r md:border-b-0 md:p-6">
        <nav className="flex flex-row gap-2 md:flex-col">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                pathname === link.href ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
