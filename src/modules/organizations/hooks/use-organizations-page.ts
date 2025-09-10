import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { useUserOrgs } from './use-user-orgs'

export function useOrganizationsPage() {
  const router = useRouter()
  const { organizations, isLoading, error, createOrganization } = useUserOrgs()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter organizations based on search query
  const filteredOrganizations = useMemo(() => {
    if (!organizations || !searchQuery.trim()) return organizations || []
    
    return organizations.filter(org => 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [organizations, searchQuery])

  const handleCreateOrganization = () => {
    router.push(routes.protected.dashboard.organizations.new)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  return {
    organizations: filteredOrganizations,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    createOrganization,
    handleCreateOrganization,
    handleClearSearch,
  }
}
