"use client";

import { LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  const t = useTranslations("accessables.view");

  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("grid")}
        className={cn(
          "rounded-r-none border-r",
          value === "grid" && "bg-accent",
        )}
        aria-label={t("grid")}
        aria-pressed={value === "grid"}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("list")}
        className={cn("rounded-l-none", value === "list" && "bg-accent")}
        aria-label={t("list")}
        aria-pressed={value === "list"}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
