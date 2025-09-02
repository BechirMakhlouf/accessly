import { OrganizationCard } from './org-card'
import { OrgWithMembers } from '../types'

interface OrganizationsGridProps {
  organizations: OrgWithMembers[]
}

export function OrganizationsGrid({ organizations }: OrganizationsGridProps) {
  if (organizations.length === 0) {
    return null
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}
    </div>
  )
}
