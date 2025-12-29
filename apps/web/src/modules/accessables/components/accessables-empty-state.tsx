"use client";

import { useTranslations } from "next-intl";
import { FileQuestion } from "lucide-react";

interface AccessablesEmptyStateProps {
  addAccessableButton: React.ReactNode;
}

export function AccessablesEmptyState({
  addAccessableButton,
}: AccessablesEmptyStateProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {t("accessables.empty.title")}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {t("accessables.empty.description")}
      </p>
      {addAccessableButton}
    </div>
  );
}
