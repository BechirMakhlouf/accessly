'use client';
import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { routes } from '@/lib/routes';
import { OrganizationsDropdown, useActiveOrg } from '@/modules/organizations';
import { BoardsDropdown, useActiveBoard } from '@/modules/boards';

export function ContextNavigation() {
  const { isOrgContext } = useActiveOrg();
  const { isUnderBoardContext } = useActiveBoard();
  return (
    <Breadcrumb>
      <BreadcrumbList className='flex items-center gap-1 min-w-0'>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href={routes.protected.dashboard.root}
              className='inline-flex h-8 items-center rounded-md px-1 -mx-1 text-foreground/80 hover:bg-accent hover:text-foreground'
            >
              <GalleryVerticalEnd className='size-4' />
              <span className='sr-only'>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className='hidden sm:block' />

        <BreadcrumbItem className='min-w-0'>
          <OrganizationsDropdown />
        </BreadcrumbItem>

        {isOrgContext && isUnderBoardContext && (
          <>
            <BreadcrumbSeparator className='hidden sm:block' />
            <BreadcrumbItem className='min-w-0'>
              <BoardsDropdown />
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
