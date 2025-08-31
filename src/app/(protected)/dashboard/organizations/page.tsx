"use client"

import { Plus, Search, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OrganizationCard } from '@/modules/organizations/components/org-card'
import { redirect } from 'next/navigation'
import { routes } from '@/lib/routes'
import { useEffect, useState } from 'react'
import { getUserOrgs } from '@/modules/organizations/actions'

import { Organization } from '@/modules/organizations/types'

interface OrganizationWithMembers extends Organization {
  organization_members: {
    user_id: string
    role: "admin" | "member" | "owner"
    joined_at: string
    last_active_at: string | null
  }[]
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithMembers[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const data = await getUserOrgs()
        if (data) {
          setOrganizations(data)
        }
      } catch (error) {
        console.error('Failed to load organizations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrganizations()
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center'>
        <div className="min-h-screen bg-background">
          <main className="container py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Loading organizations...</p>
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
              <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
              <p className="text-muted-foreground mt-2">
                Manage your organizations and collaborate with your team.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  className="pl-8 w-[300px]"
                />
              </div>
              <Button onClick={() => {
                redirect(routes.protected.dashboard.organizations.new)
              }}>
                <Plus className="mr-2 h-4 w-4" />
                New Organization
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((organization) => (
              <OrganizationCard key={organization.id} organization={organization} />
            ))}
          </div>

          {organizations.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No organizations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first organization to collaborate with your team.
                </p>
                <Button onClick={() => {
                  redirect(routes.protected.dashboard.organizations.new)
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Organization
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
