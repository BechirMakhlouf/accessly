"use client";

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useActiveOrganization } from "@/modules/organizations"
import { routes } from "@/lib/routes"
import { useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { isAdminRole } from "@/modules/organizations/utils"

interface SidebarLink {
  href: string
  label: string
}

function SettingsLayoutSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full flex-col md:flex-row">
      <aside className="w-full border-border border-b p-4 md:w-64 md:border-r md:border-b-0 md:p-6">
        <nav className="flex flex-row gap-2 md:flex-col">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full md:w-auto" />
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-10 w-full" />
        </div>
      </main>
    </div>
  );
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { activeOrganization: org, currentUserRole } = useActiveOrganization();
  const pathname = usePathname();
  const t = useTranslations("org.settings");
  const [isLoading, setIsLoading] = useState(true);

  // Add a small delay to allow the store to initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show skeleton while loading or if no active organization
  if (isLoading || !org) {
    return <SettingsLayoutSkeleton />;
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
    // Only show billing link for admins
    ...(currentUserRole && isAdminRole(currentUserRole) ? [{
      href: routes.protected.dashboard.org.slug.settings.billing(org.slug), 
      label: t("billing.title") 
    }] : []),
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
