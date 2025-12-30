"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { ACCESSABLE_TYPES, type AccessableType } from "../types";

interface AccessablesOptionsProps {
  type: AccessableType | null;
  onTypeChange: (type: AccessableType | null) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const ALL_TYPES_VALUE = "__all__";

export function AccessablesOptions({
  type,
  onTypeChange,
  hasActiveFilters,
  onClearFilters,
}: AccessablesOptionsProps) {
  const t = useTranslations("accessables");

  const handleTypeChange = (value: string) => {
    onTypeChange(value === ALL_TYPES_VALUE ? null : (value as AccessableType));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <SlidersHorizontal className="h-4 w-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{t("options.title")}</h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={onClearFilters}
              >
                <X className="mr-1 h-3 w-3" />
                {t("options.clearFilters")}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="type-filter"
              className="text-xs text-muted-foreground"
            >
              {t("options.filterByType")}
            </Label>
            <Select
              value={type ?? ALL_TYPES_VALUE}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id="type-filter">
                <SelectValue placeholder={t("options.allTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES_VALUE}>
                  {t("options.allTypes")}
                </SelectItem>
                {ACCESSABLE_TYPES.map((typeOption) => (
                  <SelectItem key={typeOption} value={typeOption}>
                    {t(`types.${typeOption}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
