"use client";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { CreditCard, Palette, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const settingsPagesUrls = [
  { id: "general", url: routes.protected.dashboard.account.settings.general, name: "General", icon: User },
  { id: "preferences", url: routes.protected.dashboard.account.settings.preferences, name: "Preferences", icon: Palette },
  { id: "account", url: routes.protected.dashboard.account.settings.account, name: "Account", icon: Settings },
  { id: "billing", url: routes.protected.dashboard.account.settings.billing, name: "Billing", icon: CreditCard },
] as const

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav
      className="grid gap-2 text-sm text-muted-foreground"
    >
      {settingsPagesUrls.map(settingsPage => {
        const Icon = settingsPage.icon
        const isActive = pathname === settingsPage.url

        return (
          <Button key={settingsPage.id} variant={isActive ? "secondary" : "ghost"} className="w-full justify-start" asChild>
            <Link href={settingsPage.url}>
              <Icon className="mr-2 h-4 w-4" />
              {settingsPage.name}
            </Link>
          </Button>
        )
      }

      )}
    </nav>
  )
}
