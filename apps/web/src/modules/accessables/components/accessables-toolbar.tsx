"use client";

import type { ReactNode } from "react";
import { ViewToggle, type ViewMode } from "./view-toggle";
import { AccessablesSearch } from "./accessables-search";
import { AccessablesOptions } from "./accessables-options";
import type { AccessableType } from "../types";

interface AccessablesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: AccessableType | null;
  onTypeChange: (type: AccessableType | null) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  addButton?: ReactNode;
}

export function AccessablesToolbar({
  search,
  onSearchChange,
  type,
  onTypeChange,
  hasActiveFilters,
  onClearFilters,
  viewMode,
  onViewModeChange,
  addButton,
}: AccessablesToolbarProps) {
  return (
    <div className="flex justify-between items-center gap-2">
      <AccessablesSearch
        value={search}
        onChange={onSearchChange}
        className="flex-1 max-w-lg"
      />
      <div className="flex space-x-2">
        <ViewToggle value={viewMode} onChange={onViewModeChange} />
        <AccessablesOptions
          type={type}
          onTypeChange={onTypeChange}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
        {addButton}
      </div>
    </div>
  );
}
