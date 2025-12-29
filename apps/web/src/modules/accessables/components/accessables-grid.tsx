"use client";

import type { Accessable } from "../types";
import { AccessableCard } from "./accessable-card";

interface AccessablesGridProps {
  accessables: Accessable[];
}

export function AccessablesGrid({ accessables }: AccessablesGridProps) {

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accessables.map((accessable) => (
        <AccessableCard key={accessable.id} accessable={accessable} />
      ))}
    </div>
  );
}
