"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Receipt,
  Settings,
  Users,
  Building2,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import { useActiveOrganization } from "@/modules/organizations";
import { routes } from "@/lib/routes";
import { useTranslations } from "next-intl";

const COLLAPSED_W = "3.05rem";
const OPEN_W = "15rem";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  match: (path: string) => boolean;
  external?: boolean;
};

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { activeOrganization: org } = useActiveOrganization();
  const t = useTranslations("sidebar");

  // Check if we're in an organization context
  const isOrgContext = pathname?.includes("/dashboard/org/");

  // Primary navigation items
  const primaryItems: NavItem[] = useMemo(() => {
    if (isOrgContext && org) {
      // Organization-specific navigation
      return [
        {
          href: routes.protected.dashboard.org.slug.root(org.slug),
          label: t("overview"),
          icon: Home,
          match: (p) => p === routes.protected.dashboard.org.slug.root(org.slug),
        },
        {
          href: routes.protected.dashboard.org.slug.members(org.slug),
          label: t("members"),
          icon: Users,
          match: (p) => p.includes(routes.protected.dashboard.org.slug.members(org.slug)),
        },
        {
          href: routes.protected.dashboard.org.slug.settings.root(org.slug),
          label: t("settings"),
          icon: Settings,
          match: (p) => p.includes(routes.protected.dashboard.org.slug.settings.root(org.slug)),
        },
      ];
    } else {
      // Dashboard navigation
      return [
        {
          href: routes.protected.dashboard.root,
          label: t("dashboard"),
          icon: Home,
          match: (p) => p === routes.protected.dashboard.root,
        },
        {
          href: routes.protected.dashboard.organizations.root,
          label: t("organizations"),
          icon: Building2,
          match: (p) => p.includes(routes.protected.dashboard.organizations.root),
        },
      ];
    }
  }, [isOrgContext, org, t]);

  // Secondary navigation items (only show in org context)
  const secondaryItems: NavItem[] = useMemo(() => {
    if (isOrgContext && org) {
      return [
        {
          href: routes.protected.dashboard.org.slug.settings.billing(org.slug),
          label: t("billing"),
          icon: Receipt,
          match: (p) => p === routes.protected.dashboard.org.slug.settings.billing(org.slug),
        },
      ];
    }
    return [];
  }, [isOrgContext, org, t]);

  // Active map for quick lookup
  const isActive = useMemo(() => {
    return (item: NavItem) => item.match(pathname || "");
  }, [pathname]);

  // Don't render sidebar if no org in org context
  if (isOrgContext && !org) {
    return null;
  }

  return (
    <div className={cn("shrink-0 h-full")} style={{ width: COLLAPSED_W }}>
      <motion.aside
        initial={false}
        animate={{ width: open ? OPEN_W : COLLAPSED_W }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={cn(
          "border-r border-border h-[calc(100vh-3.5rem)] transition-[box-shadow]",
          open ? "fixed left-0 z-40 shadow-lg" : "relative"
        )}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        role="navigation"
      >
        <div className="bg-background relative z-40 flex h-full flex-col text-muted-foreground">
          <ScrollArea className="grow p-2">
            <nav className="flex w-full flex-col gap-1">
              {primaryItems.map((item) => (
                <NavLink key={item.href} item={item} active={isActive(item)} open={open} />
              ))}

              {secondaryItems.length > 0 && (
                <>
                  <Separator className="my-1" />
                  {secondaryItems.map((item) => (
                    <NavLink key={item.href} item={item} active={isActive(item)} open={open} />
                  ))}
                </>
              )}
            </nav>
          </ScrollArea>
        </div>
      </motion.aside>
    </div>
  );
}

function NavLink({
  item,
  active,
  open,
}: {
  item: NavItem;
  active: boolean;
  open: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex h-8 w-full items-center rounded-md px-2 py-1.5 transition-colors hover:bg-muted hover:text-foreground overflow-hidden",
        active && "bg-muted text-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <Label open={open}>
        {item.label}
      </Label>
    </Link>
  );
}

function Label({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "ml-2 whitespace-nowrap text-sm font-medium",
        "transition-[opacity,transform] duration-150",
        open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
      )}
      aria-hidden={!open}
    >
      {children}
    </span>
  );
}
