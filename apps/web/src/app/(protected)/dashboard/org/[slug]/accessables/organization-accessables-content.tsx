"use client";

import { AddAccessableModal } from "@/modules/accessables/components/add-accessable-modal";
import { AccessablesGrid } from "@/modules/accessables/components/accessables-grid";
import { AccessablesList } from "@/modules/accessables/components/accessables-list";
import { AccessablesEmptyState } from "@/modules/accessables/components/accessables-empty-state";
import { AccessablesToolbar } from "@/modules/accessables/components/accessables-toolbar";
import type { ViewMode } from "@/modules/accessables/components/view-toggle";
import { useActiveOrgAccessables } from "@/modules/accessables/hooks/use-active-org-accessables";
import { useAccessablesFilters } from "@/modules/accessables/hooks/use-accessables-filters";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Skeleton } from "@/components/ui/skeleton";

function AccessablesSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrganizationAccessables() {
  const { organization, orgLevelAccessables, isLoading } =
    useActiveOrgAccessables();
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "accessables-view-mode",
    "grid",
  );
  const {
    search,
    setSearch,
    type,
    setType,
    filteredAccessables,
    clearFilters,
    hasActiveFilters,
  } = useAccessablesFilters(orgLevelAccessables);

  if (isLoading || !organization) {
    return <AccessablesSkeleton />;
  }

  const addButton = <AddAccessableModal organizationId={organization.id} />;

  if (orgLevelAccessables.length === 0) {
    return <AccessablesEmptyState addAccessableButton={addButton} />;
  }

  return (
    <div className="space-y-4">
      <AccessablesToolbar
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        addButton={addButton}
      />
      {viewMode === "grid" ? (
        <AccessablesGrid accessables={filteredAccessables} />
      ) : (
        <AccessablesList accessables={filteredAccessables} />
      )}
    </div>
  );
}
