"use client"

import { useEffect, useState } from 'react'
import { OrganizationsHeader } from '@/modules/organizations/components/organizations-header'
import { OrganizationsGrid } from '@/modules/organizations/components/organizations-grid'
import { OrganizationsEmptyState } from '@/modules/organizations/components/organizations-empty-state'
import { OrganizationsLoadingState } from '@/modules/organizations/components/organizations-loading-state'
import { useOrganizationsPage } from '@/modules/organizations'

export default function OrganizationsPage() {
  const [isHydrated, setIsHydrated] = useState(false)
  const {
    organizations,
    searchQuery,
    setSearchQuery,
    isLoading,
    handleCreateOrganization,
    handleClearSearch,
  } = useOrganizationsPage()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated || isLoading) {
    return <OrganizationsLoadingState />
  }

  return (
    <div className='flex justify-center'>
      <div className="min-h-screen bg-background">
        <main className="container py-8">
          <OrganizationsHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateOrganization={handleCreateOrganization}
          />

          <OrganizationsGrid organizations={organizations} />

          {organizations.length === 0 && (
            <OrganizationsEmptyState
              hasSearchQuery={!!searchQuery}
              searchQuery={searchQuery}
              onClearSearch={handleClearSearch}
              onCreateOrganization={handleCreateOrganization}
            />
          )}
        </main>
      </div>
    </div>
  )
}