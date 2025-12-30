"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Accessable, AccessableType } from "../types";
import { ACCESSABLE_TYPES } from "../types";

export type AccessablesFilters = {
  search: string;
  type: AccessableType | null;
};

export function useAccessablesFilters(accessables: Accessable[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") ?? "";
  const initialType = searchParams.get("type") as AccessableType | null;
  const validInitialType =
    initialType && ACCESSABLE_TYPES.includes(initialType) ? initialType : null;

  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState<AccessableType | null>(validInitialType);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (type) {
      params.set("type", type);
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl, { scroll: false });
  }, [search, type, pathname, router]);

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
