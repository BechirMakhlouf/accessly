"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import { Check, ChevronsUpDown, Plus, Search, Building2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

// Sample organizations data
const organizations = [
  { id: 1, name: "Acme Corporation", type: "Enterprise" },
  { id: 2, name: "TechStart Inc.", type: "Startup" },
]

export function OrganizationsDropdown({ trigger }: { trigger?: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<(typeof organizations)[0] | null>(organizations[0])
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
  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectOrganization = (org: (typeof organizations)[0]) => {
    setSelectedOrg(org)
    setOpen(false)
    setSearchQuery("")
  }
  const handleAddOrganization = () => {

    // Handle add organization logic here
    console.log("Add new organization")
    setOpen(false)
    setSearchQuery("")
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
                {filteredOrganizations.map((org) => (
                  <div
                    key={org.id}
                    className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSelectOrganization(org)}
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{org.name}</span>
                      <span className="text-xs text-muted-foreground">{org.type}</span>
                    </div>
                    {selectedOrg?.id === org.id && <Check className="h-4 w-4 text-primary" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">No organizations found.</div>
            )}
          </div>
          <Separator />
          <div className="p-1">
            <div
              className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={handleAddOrganization}
            >
              <Plus className="h-4 w-4" />
              <span>Add organization</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
