"use client";

import { useMemo, useCallback } from "react";
import { useQueryState, parseAsString, parseAsStringLiteral } from "nuqs";
import type { Accessable, AccessableType } from "../types";
import { ACCESSABLE_TYPES } from "../types";

export type AccessablesFilters = {
  search: string;
  type: AccessableType | null;
};

export function useAccessablesFilters(accessables: Accessable[]) {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const [type, setType] = useQueryState(
    "type",
    parseAsStringLiteral(ACCESSABLE_TYPES).withDefault(
      null as unknown as AccessableType,
    ),
  );

  const filteredAccessables = useMemo(() => {
    let result = accessables;

    if (type) {
      result = result.filter((a) => a.type === type);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.description?.toLowerCase().includes(query) ||
          a.type.toLowerCase().includes(query),
      );
    }

    return result;
  }, [accessables, search, type]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setType(null);
  }, []);

  const hasActiveFilters = Boolean(search || type);

  return {
    search,
    setSearch,
    type,
    setType,
    filteredAccessables,
    clearFilters,
    hasActiveFilters,
  };
}
