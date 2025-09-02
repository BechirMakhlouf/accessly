import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { getUserOrgs } from '../actions'
import { useOrganizationsStore } from '../store'
import { OrgWithMembers } from '../types'

export function useOrganizationsPage() {
  const router = useRouter()
  const { setOrganizations, isLoading, setLoading, setError } = useOrganizationsStore()
  const [organizations, setLocalOrganizations] = useState<OrgWithMembers[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setLoading(true)
        const data = await getUserOrgs()
        if (data) {
          setLocalOrganizations(data)
          setOrganizations(data)
        }
      } catch (error) {
        console.error('Failed to load organizations:', error)
        setError('Failed to load organizations')
      } finally {
        setLoading(false)
      }
    }

    loadOrganizations()
  }, [setOrganizations, setLoading, setError])

  // Filter organizations based on search query
  const filteredOrganizations = useMemo(() => {
    if (!searchQuery.trim()) return organizations
    
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
    handleCreateOrganization,
    handleClearSearch,
  }
}
