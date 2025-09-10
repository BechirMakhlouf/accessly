"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import { Check, ChevronsUpDown, Plus, Search, Building2, Crown, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { routes } from "@/lib/routes"
import { useActiveOrg, useUserOrgs, Organization } from "@/modules/organizations"
import { useAuth } from "@/lib/auth"

export function OrganizationsDropdown({ trigger }: { trigger?: ReactNode }) {
  const router = useRouter()
  const { user } = useAuth()
  const { organization: org, setActiveOrganization: setOrg } = useActiveOrg()
  const { organizations, isLoading } = useUserOrgs()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      // Small delay to ensure the popover is fully rendered
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Filter organizations based on search query
  const filteredOrganizations = organizations?.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  ) || []

  const handleSelectOrganization = (selectedOrg: Organization) => {
    setOrg(selectedOrg)
    setOpen(false)
    setSearchQuery("")

    // Navigate to the selected organization
    router.push(routes.protected.dashboard.org.slug.root(selectedOrg.slug || ""))
  }

  const handleAddOrganization = () => {
    setOpen(false)
    setSearchQuery("")
    router.push(routes.protected.dashboard.organizations.new)
  }

  const handleViewAllOrganizations = () => {
    setOpen(false)
    setSearchQuery("")
    router.push(routes.protected.dashboard.organizations.root)
  }

  const getMemberCount = (org: Organization) => {
    // If the organization has members data, use it, otherwise show 0
    if ('organization_members' in org && Array.isArray(org.organization_members)) {
      return org.organization_members.length
    }
    return 0
  }

  const getUserRole = (org: Organization) => {
    // If the organization has members data, find the current user's role
    if ('organization_members' in org && Array.isArray(org.organization_members) && user) {
      const membership = org.organization_members.find((m: { user_id: string; role: string }) => m.user_id === user.id)
      return membership?.role || "member"
    }
    return "member"
  }

  if (!user) {
    return null // Don't show dropdown if user is not authenticated
  }

  if (isLoading && (!organizations || organizations.length === 0)) {
    return (
      <div className="w-full max-w-sm">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {trigger ?? <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading organizations...
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {trigger ?? <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredOrganizations.length > 0 ? (
              <div className="p-1">
                {filteredOrganizations.map((organization) => {
                  const isSelected = org?.id === organization.id
                  const userRole = getUserRole(organization)
                  const memberCount = getMemberCount(organization)

                  return (
                    <div
                      key={organization.id}
                      className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleSelectOrganization(organization)}
                    >
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{organization.name}</span>
                          {userRole === "admin" && (
                            <Crown className="h-3 w-3 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="truncate">{organization.slug}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {memberCount}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {searchQuery ? "No organizations found." : "No organizations available."}
              </div>
            )}
          </div>

          <Separator />

          <div className="p-1 space-y-1">
            <div
              className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={handleAddOrganization}
            >
              <Plus className="h-4 w-4" />
              <span>Create organization</span>
            </div>

            {organizations && organizations.length > 0 && (
              <div
                className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={handleViewAllOrganizations}
              >
                <Building2 className="h-4 w-4" />
                <span>View all organizations</span>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
