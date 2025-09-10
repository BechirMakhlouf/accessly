"use client";
import { ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { routes } from "@/lib/routes"
import { OrganizationsDropdown } from "@/modules/organizations"
import { AppSearchBar } from "./app-search-bar"
import UserDropdown from "./user-dropdown"
import { NotificationsPopover } from "./notification-popover"
import { useActiveOrg } from "@/modules/organizations"
import { useAuth } from "@/lib/auth"

export function AppHeader() {
  const { activeOrganization: org } = useActiveOrg()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        {/* Left: Brand + Org */}
        <div className="min-w-0">
          <Breadcrumb>
            <BreadcrumbList className="flex items-center gap-1 min-w-0">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={routes.protected.dashboard.root}
                    className="inline-flex h-8 items-center rounded-md px-1 -mx-1 text-foreground/80 hover:bg-accent hover:text-foreground"
                  >
                    <GalleryVerticalEnd className="size-4" />
                    <span className="sr-only">Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden sm:block" />

              <BreadcrumbItem className="min-w-0">
                <div className="flex items-center gap-1">
                  {org ? (
                    <Link
                      href={routes.protected.dashboard.org.slug.root(org.slug || "")}
                      className="inline-flex h-8 items-center gap-2 rounded-md px-2 hover:bg-accent max-w-[50vw] sm:max-w-[320px] whitespace-nowrap"
                    >
                      <span className="truncate text-sm leading-none">{org.name}</span>
                      <Badge
                        variant="default"
                        className="hidden sm:inline-flex leading-none"
                      >
                        Free
                      </Badge>
                    </Link>
                  ) : user ? (
                    <Link
                      href={routes.protected.dashboard.organizations.root}
                      className="inline-flex h-8 items-center gap-2 rounded-md px-2 hover:bg-accent max-w-[50vw] sm:max-w-[320px] whitespace-nowrap"
                    >
                      <span className="truncate text-sm leading-none text-muted-foreground">
                        Select Organization
                      </span>
                    </Link>
                  ) : null}

                  {user && (
                    <OrganizationsDropdown trigger={<Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 data-[state=open]:bg-accent"
                      aria-label="Switch organization"
                    >
                      <ChevronsUpDown className="size-4 opacity-60" />
                    </Button>
                    } />
                  )}
                </div>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <AppSearchBar />
          <NotificationsPopover />
          <UserDropdown />
        </div>
      </div>
    </header>

  )
}
