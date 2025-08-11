"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Blocks,
  LayoutDashboard,
  Receipt,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";

const COLLAPSED_W = "3.05rem";
const OPEN_W = "15rem";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  match: (path: string) => boolean;
  after?: React.ReactNode;
};

const primaryItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: (p) => p.includes("/dashboard"),
  },
  {
    href: "/members",
    label: "Members",
    icon: Users,
    match: (p) => p.includes("/members") && p.includes("/dashboard"),
  },
];

const secondaryItems: NavItem[] = [
  {
    href: "/integrations",
    label: "Integrations",
    icon: Blocks,
    match: (p) => p.includes("/chat"),
    after: <></>,
  },
  {
    href: "/billing",
    label: "Billing",
    icon: Receipt,
    match: (p) => p.includes("/chat"),
    after: <></>,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: SlidersHorizontal,
    match: (p) => p.includes("/chat"),
    after: <></>,
  }
];

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  console.log(pathname.split("/").at(-1));
  // Active map for quick lookup
  const isActive = useMemo(() => {
    return (item: NavItem) => item.match(pathname || "");
  }, [pathname]);

  return (
    <>
      <div className={cn("shrink-0 h-full")} style={{ width: COLLAPSED_W }}>
        <motion.aside
          // SSR-safe initial width: render collapsed on server, animate only after interaction
          initial={false}
          animate={{ width: open ? OPEN_W : COLLAPSED_W }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className={cn(
            "border-r border-border h-[calc(100vh-3.5rem)] transition-[box-shadow]",
            open ? "fixed left-0 z-40 shadow-lg" : "relative"
          )}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          aria-expanded={open}
          role="navigation"
        >
          <div className="bg-background relative z-40 flex h-full flex-col text-muted-foreground">
            <ScrollArea className="grow p-2">
              <nav className="flex w-full flex-col gap-1">
                {primaryItems.map((item) => (
                  <NavLink key={item.href} item={item} active={isActive(item)} open={open} />
                ))}

                <Separator className="my-1" />

                {secondaryItems.map((item) => (
                  <NavLink key={item.href} item={item} active={isActive(item)} open={open} />
                ))}

                <Separator className="my-1" />
              </nav>
            </ScrollArea>
          </div>
        </motion.aside>
      </div>
    </>
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
        {item.after ? <span className="ml-2">{item.after}</span> : null}
      </Label>
    </Link>
  );
}

function Label({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "ml-2 whitespace-nowrap bold text-sm font-medium",
        // smooth reveal when opening
        "transition-[opacity,transform] duration-150",
        open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
      )}
      aria-hidden={!open}
    >
      {children}
    </span>
  );
}
