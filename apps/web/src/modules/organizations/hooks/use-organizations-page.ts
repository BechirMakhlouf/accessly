"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { routes } from "@/lib/routes";
import { useUserOrgs } from "./use-user-orgs";

export function useOrganizationsPage() {
  const router = useRouter();

  const { organizations, isLoading, error, createOrganization } = useUserOrgs();

  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const filteredOrganizations = useMemo(() => {
    if (!organizations) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return organizations;

    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        org.description?.toLowerCase().includes(query) ||
        org.slug.toLowerCase().includes(query),
    );
  }, [organizations, searchQuery]);

  const handleCreateOrganization = () => {
    router.push(routes.protected.dashboard.organizations.new);
  };

  const handleClearSearch = () => setSearchQuery("");

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
