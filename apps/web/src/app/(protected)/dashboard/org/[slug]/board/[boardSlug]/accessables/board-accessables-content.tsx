"use client";

import { AddAccessableModal } from "@/modules/accessables/components/add-accessable-modal";
import { AccessablesGrid } from "@/modules/accessables/components/accessables-grid";
import { AccessablesEmptyState } from "@/modules/accessables/components/accessables-empty-state";
import { useBoardAccessablesHook } from "@/modules/accessables/hooks/use-board-accessables-hook";
import { Skeleton } from "@/components/ui/skeleton";

interface BoardAccessablesContentProps {
  organizationId: string;
  boardId: string;
}

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

export function BoardAccessablesContent({
  organizationId,
  boardId,
}: BoardAccessablesContentProps) {
  const { accessables, isLoading } = useBoardAccessablesHook({
    boardId,
    organizationId,
  });

  if (isLoading) {
    return <AccessablesSkeleton />;
  }

  const addButton = (
    <AddAccessableModal organizationId={organizationId} boardId={boardId} />
  );

  if (accessables.length === 0) {
    return <AccessablesEmptyState addAccessableButton={addButton} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">{addButton}</div>
      <AccessablesGrid accessables={accessables} />
    </div>
  );
}
