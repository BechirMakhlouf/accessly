'use client';

import { useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { routes } from '@/lib/routes';
import { useUserOrgs } from './use-user-orgs';

export function useOrganizationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { organizations, isLoading, error, createOrganization } = useUserOrgs();

  const initialQuery = searchParams.get('search') ?? '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [searchQuery, pathname, router, searchParams]);

  const filteredOrganizations = useMemo(() => {
    if (!organizations) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return organizations;

    return organizations.filter(
      org =>
        org.name.toLowerCase().includes(query) ||
        org.description?.toLowerCase().includes(query) ||
        org.slug.toLowerCase().includes(query)
    );
  }, [organizations, searchQuery]);

  const handleCreateOrganization = () => {
    router.push(routes.protected.dashboard.organizations.new);
  };

  const handleClearSearch = () => setSearchQuery('');

  return {
    organizations: filteredOrganizations,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    createOrganization,
    handleCreateOrganization,
    handleClearSearch,
  };
}
