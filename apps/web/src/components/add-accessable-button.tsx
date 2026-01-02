"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useActiveOrg } from "@/modules/organizations";
import { AddAccessableModal } from "@/modules/accessables/components/add-accessable-modal";

export function AddAccessableButton() {
  const { organization, isOrgContext } = useActiveOrg();
  const t = useTranslations("accessables.actions");

  if (!isOrgContext || !organization?.id) return null;

  return (
    <AddAccessableModal
      organizationId={organization.id}
      trigger={
        <Button variant="default" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>{t("create")}</span>
        </Button>
      }
    />
  );
}
