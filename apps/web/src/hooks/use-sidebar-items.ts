'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useActiveOrg } from '@/modules/organizations';
import { useActiveBoard } from '@/modules/boards';
import { routes } from '@/lib/routes';
import {
  Building2,
  FileText,
  Home,
  Layout,
  Receipt,
  Settings,
  Users,
} from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  match: (path: string) => boolean;
  external?: boolean;
};

export function useSidebarItems() {
  const pathname = usePathname();
  const { activeOrganization: org } = useActiveOrg();
  const { activeBoard, isUnderBoardContext, orgSlug, boardSlug } =
    useActiveBoard();
  const t = useTranslations('sidebar');

  // Check if we're in an organization context
  const isOrgContext = pathname?.includes('/dashboard/org/');

  const sidebarItems = useMemo(() => {
    // Board context - show board-specific navigation
    if (isUnderBoardContext && activeBoard && orgSlug && boardSlug) {
      return {
        primary: [
          {
            href: routes.protected.dashboard.org.slug.board.root(
              orgSlug,
              boardSlug
            ),
            label: t('overview'),
            icon: Home,
            match: (p: string) =>
              p ===
              routes.protected.dashboard.org.slug.board.root(
                orgSlug,
                boardSlug
              ),
          },
          {
            href: routes.protected.dashboard.org.slug.board.accessables(
              orgSlug,
              boardSlug
            ),
            label: t('accessables'),
            icon: FileText,
            match: (p: string) =>
              p.includes(
                routes.protected.dashboard.org.slug.board.accessables(
                  orgSlug,
                  boardSlug
                )
              ),
          },
          {
            href: routes.protected.dashboard.org.slug.board.members(
              orgSlug,
              boardSlug
            ),
            label: t('members'),
            icon: Users,
            match: (p: string) =>
              p.includes(
                routes.protected.dashboard.org.slug.board.members(
                  orgSlug,
                  boardSlug
                )
              ),
          },
          {
            href: routes.protected.dashboard.org.slug.board.settings(
              orgSlug,
              boardSlug
            ),
            label: t('settings'),
            icon: Settings,
            match: (p: string) =>
              p.includes(
                routes.protected.dashboard.org.slug.board.settings(
                  orgSlug,
                  boardSlug
                )
              ),
          },
        ] as NavItem[],
        secondary: [] as NavItem[],
      };
    }

    // Organization context - show organization-specific navigation
    if (isOrgContext && org) {
      return {
        primary: [
          {
            href: routes.protected.dashboard.org.slug.root(org.slug),
            label: t('overview'),
            icon: Home,
            match: (p: string) => {
              const orgRoot = routes.protected.dashboard.org.slug.root(
                org.slug
              );
              return p === orgRoot || p === orgRoot.slice(0, -1);
            },
          },
          {
            href: routes.protected.dashboard.org.slug.boards.root(org.slug),
            label: t('boards'),
            icon: Layout,
            match: (p: string) =>
              p.includes(
                routes.protected.dashboard.org.slug.boards.root(org.slug)
              ),
          },
          {
            href: routes.protected.dashboard.org.slug.members(org.slug),
            label: t('members'),
            icon: Users,
            match: (p: string) =>
              p.includes(routes.protected.dashboard.org.slug.members(org.slug)),
          },
          {
            href: routes.protected.dashboard.org.slug.settings.root(org.slug),
            label: t('settings'),
            icon: Settings,
            match: (p: string) =>
              p.includes(
                routes.protected.dashboard.org.slug.settings.root(org.slug)
              ),
          },
        ] as NavItem[],
        secondary: [
          {
            href: routes.protected.dashboard.org.slug.settings.billing(
              org.slug
            ),
            label: t('billing'),
            icon: Receipt,
            match: (p: string) =>
              p ===
              routes.protected.dashboard.org.slug.settings.billing(org.slug),
          },
        ] as NavItem[],
      };
    }

    // Dashboard context - show main dashboard navigation
    return {
      primary: [
        {
          href: routes.protected.dashboard.root,
          label: t('dashboard'),
          icon: Home,
          match: (p: string) => p === routes.protected.dashboard.root,
        },
        {
          href: routes.protected.dashboard.organizations.root,
          label: t('organizations'),
          icon: Building2,
          match: (p: string) =>
            p.includes(routes.protected.dashboard.organizations.root),
        },
      ] as NavItem[],
      secondary: [] as NavItem[],
    };
  }, [
    isUnderBoardContext,
    activeBoard,
    orgSlug,
    boardSlug,
    isOrgContext,
    org,
    t,
  ]);

  // Active map for quick lookup
  const isActive = useMemo(() => {
    return (item: NavItem) => item.match(pathname || '');
  }, [pathname]);

  // Don't render sidebar if no org in org context or no board in board context
  const shouldRender = useMemo(() => {
    if (isOrgContext && !org) return false;
    if (isUnderBoardContext && !activeBoard) return false;
    return true;
  }, [isOrgContext, org, isUnderBoardContext, activeBoard]);

  return {
    primaryItems: sidebarItems.primary,
    secondaryItems: sidebarItems.secondary,
    isActive,
    shouldRender,
  };
}
