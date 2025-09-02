"use client"

import { useActiveOrganization } from "../hooks/use-active-organization"
import { OrgNameSettings } from "./org-name-settings"
import { OrgSlugSettings } from "./org-slug-settings"
import { DeleteOrgDangerZone } from "./delete-org-danger-zone"

export function OrgSettings() {
  const { activeOrganization: org } = useActiveOrganization();

  if (!org) {
    return null;
  }

  return (
    <div className="space-y-6">
      <OrgNameSettings />
      <OrgSlugSettings />
      <DeleteOrgDangerZone />
    </div>
  )
}