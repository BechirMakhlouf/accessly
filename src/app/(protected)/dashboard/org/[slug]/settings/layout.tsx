"use client";

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation" // This will make the component a client component

// This component needs to be a client component to use usePathname
// It's better to extract the navigation into its own client component
// and keep the layout as a server component if possible.
// However, for simplicity and directness, I'll mark this layout as client.
// A more robust solution would be to pass the pathname as a prop to a client nav component.
// For this example, I'll make the layout a client component.

import type React from "react"

interface SidebarLink {
  href: string
  label: string
}

const sidebarLinks: SidebarLink[] = [
  { href: "/dashboard/org/3/settings/general", label: "General" },
  { href: "/dashboard/org/3/settings/security", label: "Security" },
  { href: "/dashboard/org/3/settings/billing", label: "Billing" },
  { href: "/dashboard/org/3/settings/integrations", label: "Integrations" },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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
