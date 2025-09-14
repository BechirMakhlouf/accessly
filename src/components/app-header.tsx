import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { routes } from "@/lib/routes"
import { OrganizationsDropdown } from "@/modules/organizations"
import { AppSearchBar } from "./app-search-bar"
import UserDropdown from "./user-dropdown"
import { NotificationsPopover } from "./notification-popover"

export function AppHeader() {
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
                  <OrganizationsDropdown />
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
