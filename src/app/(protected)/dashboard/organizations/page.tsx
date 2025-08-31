"use client"

import { Plus, Search, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OrganizationCard } from '@/modules/organizations/components/org-card'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { useEffect, useState, useMemo } from 'react'
import { getUserOrgs } from '@/modules/organizations/actions'
import { useTranslations } from 'next-intl'
import { useOrganizationsStore } from '@/modules/organizations/store'

import { Organization } from '@/modules/organizations/types'

//TODO: this belongs to types.ts
interface OrganizationWithMembers extends Organization {
  organization_members: {
    user_id: string
    role: "admin" | "member" | "owner"
    joined_at: string
    last_active_at: string | null
  }[]
}

export default function OrganizationsPage() {
  const router = useRouter()
  const t = useTranslations('organizations')
  const { setOrganizations, isLoading, setLoading, setError } = useOrganizationsStore()
  const [organizations, setLocalOrganizations] = useState<OrganizationWithMembers[]>([])
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

  if (isLoading) {
    return (
      <div className='flex justify-center'>
        <div className="min-h-screen bg-background">
          <main className="container py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">{t('loading')}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className='flex justify-center'>
      <div className="min-h-screen bg-background">
        <main className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
              <p className="text-muted-foreground mt-2">
                {t('description')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('search.placeholder')}
                  className="pl-8 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateOrganization}>
                <Plus className="mr-2 h-4 w-4" />
                {t('actions.create')}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrganizations.map((organization) => (
              <OrganizationCard key={organization.id} organization={organization} />
            ))}
          </div>

          {filteredOrganizations.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                {searchQuery ? (
                  <>
                    <h3 className="text-lg font-semibold mb-2">{t('search.noResults.title')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('search.noResults.description', { query: searchQuery })}
                    </p>
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      {t('search.clear')}
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-2">{t('empty.title')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('empty.description')}
                    </p>
                    <Button onClick={handleCreateOrganization}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('actions.create')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
